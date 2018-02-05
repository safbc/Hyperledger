package utils

import org.apache.commons.io.FileUtils

class EnvironmentUtils {
    companion object {
        val testPoolIP = System.getenv("TEST_POOL_IP") ?: "127.0.0.1"

        fun getTmpPath(filename: String): String = FileUtils.getTempDirectoryPath() + "/indy/" + filename
    }
}
