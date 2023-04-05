import jetbrains.buildServer.configs.kotlin.v2019_2.*
import uu.pipeline.projectTypes.*
import uu.pipeline.config.RuntimeStacks

version = "2021.1"

nodejsSubApp {
  product = "uu_jokes_maing01"
  runtimeStack = RuntimeStacks.UU_APPG01_APPSERVER_NODEJS_STACK_2_1

  addEnvironment("uat")
}
