import com.google.gson.*
import org.hyperledger.indy.sdk.LibIndy
import org.hyperledger.indy.sdk.pool.*
import org.hyperledger.indy.sdk.wallet.*
import org.reflections.Reflections
import org.reflections.scanners.*
import org.reflections.util.*
import spark.Spark.*
import utils.PoolUtils
import java.io.File
import java.lang.management.ManagementFactory
import java.net.*
import java.nio.charset.StandardCharsets
import java.util.Base64
import java.util.concurrent.CompletableFuture

fun main(args: Array<String>) {
    port(4000)

    val reflections = Reflections(ConfigurationBuilder()
            .setScanners(SubTypesScanner(false), ResourcesScanner())
            .setUrls(ClasspathHelper.forClassLoader())
            .filterInputsBy(FilterBuilder().include(FilterBuilder.prefix("org.hyperledger.indy.sdk"))))

    if (!LibIndy.isInitialized()) LibIndy.init(File("lib/libindy.so"))

    val indyPath = "${System.getProperty("user.home")}/.indy_client"

    val poolName = PoolUtils.DEFAULT_POOL_NAME
    val genesisTxnFile = File("$indyPath/pool/$poolName/$poolName.txn")

    if (!genesisTxnFile.exists())
        PoolUtils.createPoolLedgerConfig()

    val config2 = PoolJSONParameters.OpenPoolLedgerJSONParameter(null, null, null)
    val pool = Pool.openPoolLedger(poolName, config2.toJson()).get()

    Runtime.getRuntime().addShutdownHook(Thread(Runnable { pool.closePoolLedger().get() }))

    val schema = File("schema.json").readText(StandardCharsets.UTF_8)

    val wallets = mutableMapOf<String, Wallet>()

    before("*") { req, res ->
        println("${req.requestMethod()} ${req.pathInfo()}")
        res.type("application/json")
    }

    get("/", { _, _ ->
        val runtimeSecs = ManagementFactory.getRuntimeMXBean().uptime / 1000

        hashMapOf(
            "pool_name" to poolName,
            "sdk" to "1.1.0",
            "uptime" to String.format(
                    "%02d:%02d:%02d",
                    runtimeSecs / 3600,
                    (runtimeSecs % 3600) / 60,
                    runtimeSecs % 60
            )
        )
    }, Gson()::toJson)

    post("/request") { req, _ ->
        val jsonObject = JsonParser().parse(req.body()).asJsonObject
        val className = jsonObject["class_name"].asString
        val methodName = jsonObject["method_name"].asString

        val clazz = reflections.getSubTypesOf(Any::class.java)
                .filter { it.canonicalName != null }
                .first { it.canonicalName.split(".").last() == className }

        val method = clazz.methods.first { it.name == methodName }
        val arguments = mutableListOf<Any?>()
        val jsonArray = jsonObject["args"].asJsonArray

        for ((index, param) in method.parameters.withIndex()) {
            val jsonIndex = if (method.parameters.first().type.simpleName == "Pool") index - 1 else index

            if (jsonIndex < jsonArray.size()) {
                when (param.type.simpleName) {
                    "boolean" ->
                        arguments.add(jsonArray[jsonIndex].asBoolean)
                    "int" ->
                        arguments.add(jsonArray[jsonIndex].asInt)
                    "byte[]" ->
                        arguments.add(Base64.getDecoder().decode(jsonArray[jsonIndex].asString))
                    "Pool" ->
                        arguments.add(pool)
                    "Wallet" -> {
                        val walletName = jsonArray[jsonIndex].asString

                        if (!wallets.contains(walletName))
                            wallets[walletName] = Wallet.openWallet(walletName, null, null).get()

                        arguments.add(wallets[walletName])
                    } else ->
                        if (jsonArray[jsonIndex].asString == "null")
                            arguments.add(null)
                        else
                            arguments.add(jsonArray[jsonIndex].asString)
                }
            } else
                arguments.add(null)
        }

        @SuppressWarnings("unchecked")
        val result: CompletableFuture<Any> = method.invoke(null, *arguments.toTypedArray()) as CompletableFuture<Any>
        val response = result.get()

        wallets.forEach { it.value.closeWallet().get() }
        wallets.clear()

        when (response) {
            is String -> response
            else -> Gson().toJson(response)
        }
    }

    get("/schema") { _, _ -> schema }

    path("/wallet") {
        get("/list", { _, _ ->
            hashMapOf("wallets" to File("$indyPath/wallet").list()?.toSortedSet())
        }, Gson()::toJson)

        post("/:wallet_name") { req, _ ->
            val walletName = req.params(":wallet_name")
            Wallet.createWallet(poolName, walletName, "default", null, null).get()
            "{\"success\":true}"
        }

        delete("/:wallet_name") { req, _ ->
            val walletName = req.params(":wallet_name")
            Wallet.deleteWallet(walletName, null).get()
            "{\"success\":true}"
        }
    }

    exception(Exception::class.java) { e, req, res ->
        println(req.body())
        println(e.printStackTrace())

        res.status(400)
        res.body("{\"error\":\"${e.message}\"}")

        wallets.forEach { it.value.closeWallet().get() }
        wallets.clear()
    }

    internalServerError { _, res ->
        res.body("{\"error\":\"Internal Server Error\"}")
    }

    notFound { req, _ ->
        "{\"error\":\"No route for ${req.requestMethod()} ${req.pathInfo()}\"}"
    }

    awaitInitialization()

    val http = URL("http://localhost:4000/request").openConnection() as HttpURLConnection
    http.doOutput = true

    val json = """
        {
            "class_name":"Crypto",
            "method_name":"cryptoSign",
            "args":["their_wallet","GJ1SzoWzavQYfNL9XkaJdrQejfztN4XqdsiV4ct3LXKL","7b226d657373616765223a20223432227d"]
        }
    """
//    val json = """
//        {
//            "class_name":"Ledger",
//            "method_name":"signAndSubmitRequest",
//            "args":["my_wallet","FpMHL4Q4VwcXePDHEtTYgV","{\"reqId\":1511717978635533125,\"identifier\": \"FpMHL4Q4VwcXePDHEtTYgV\",\"operation\":{\"dest\":\"6HXK2EAs6eR2jiRn9MPVao\",\"type\":\"1\",\"verkey\":\"3t4nT4xm7MNsVj9q1FgMyFaoTBZHcScZCaQJUQquFQ3w\"}}"]
//        }
//
//    """

    val output = json.toByteArray(StandardCharsets.UTF_8)
    http.setFixedLengthStreamingMode(output.size)
    http.setRequestProperty("Content-Type", "application/json; charset=UTF-8")
    http.connect()

    http.outputStream.use { os -> os.write(output) }

    val inputStream = if (http.responseCode >= 400) http.errorStream else http.inputStream
    inputStream.use { it.reader().use { reader -> println(reader.readText()) } }
}
