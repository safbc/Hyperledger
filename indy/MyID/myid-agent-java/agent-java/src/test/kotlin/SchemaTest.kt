import com.google.gson.*
//import com.google.gson.GsonBuilder
import org.junit.*
import com.thoughtworks.qdox.JavaProjectBuilder
import java.io.File


class SchemaTest {

    @Test
    fun testGenerateSchema() {
        val path = "../indy-sdk/wrappers/java/src/main/"
        val output = mutableMapOf<String, Any>()

        val builder = JavaProjectBuilder()

        builder.addSourceTree(File(path))

        builder.classes
                .filter { !it.canonicalName.contains(Regex("pool|wallet")) }
                .filter {
                    val parts = it.canonicalName.toLowerCase().split(".").reversed()
                    parts[0] == parts[1]
                }.forEach(fun (clazz) {
                    val methods = mutableMapOf<String, Any>()

                    clazz.methods.sortBy { it.name }

                    clazz.methods.forEach(fun (m) {
                        val method = mutableMapOf<String, Any>()
                        val params = mutableListOf<List<String>>()
                        val returnType = m.returnType.toGenericString().split("<").last()
                                .split(">").first().split(".").last()

                        for ((index, param) in m.parameters.withIndex()) {
                            val paramType = param.type.canonicalName.split(".").last()
                            params.add(listOf(paramType, param.name, m.tags[index].value))
                        }

                        method.put("desc", m.comment)
                        method.put("params", params)
                        method.put("return", listOf(returnType, m.getTagByName("return").value))

                        methods.put(m.name, method)
                    })
                    output.put(clazz.simpleName, methods)
                })
        val json = Gson().toJson(output) // Minify
//        val json = GsonBuilder().setPrettyPrinting().create().toJson(output) // Beautify

        println(json)
    }
}
