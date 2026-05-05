import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("org.jetbrains.kotlin.plugin.serialization")
}

val localProperties = Properties().apply {
    val localPropsFile = rootProject.file("local.properties")
    if (localPropsFile.exists()) {
        localPropsFile.inputStream().use { load(it) }
    }
}

fun propOrEnv(name: String, envName: String = name): String =
    (localProperties.getProperty(name) ?: System.getenv(envName)).orEmpty().trim()

fun quoted(value: String): String {
    val escaped = value.replace("\\", "\\\\").replace("\"", "\\\"")
    return "\"$escaped\""
}

val supabaseUrl = propOrEnv("SUPABASE_URL")
val supabasePublishableKey = propOrEnv("SUPABASE_PUBLISHABLE_KEY")
val bytecodeApiUrl = propOrEnv("BYTECODE_API_URL").ifBlank { "https://bytecode-web.craftyjhs-projects.vercel.app" }
val webBaseUrl = propOrEnv("WEB_BASE_URL").ifBlank { "https://bytecode-web.craftyjhs-projects.vercel.app" }

val releaseStoreFilePath = propOrEnv("ANDROID_SIGNING_STORE_FILE")
val releaseStorePassword = propOrEnv("ANDROID_SIGNING_STORE_PASSWORD")
val releaseKeyAlias = propOrEnv("ANDROID_SIGNING_KEY_ALIAS")
val releaseKeyPassword = propOrEnv("ANDROID_SIGNING_KEY_PASSWORD")
val releaseStoreFile = releaseStoreFilePath
    .takeIf { it.isNotBlank() }
    ?.let { file(it) }
val hasReleaseSigning = releaseStoreFile?.exists() == true &&
    releaseStorePassword.isNotBlank() &&
    releaseKeyAlias.isNotBlank() &&
    releaseKeyPassword.isNotBlank()

android {
    namespace = "dev.bytecode.android"
    compileSdk = 35

    defaultConfig {
        applicationId = "dev.bytecode.android"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        buildConfigField("String", "SUPABASE_URL", quoted(supabaseUrl))
        buildConfigField("String", "SUPABASE_PUBLISHABLE_KEY", quoted(supabasePublishableKey))
        buildConfigField("String", "BYTECODE_API_URL", quoted(bytecodeApiUrl))
        buildConfigField("String", "WEB_BASE_URL", quoted(webBaseUrl))
    }

    signingConfigs {
        create("release") {
            if (hasReleaseSigning) {
                storeFile = releaseStoreFile
                storePassword = releaseStorePassword
                keyAlias = releaseKeyAlias
                keyPassword = releaseKeyPassword
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = if (hasReleaseSigning) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.15"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2025.01.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.10.0")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.8.5")

    implementation("io.github.jan-tennert.supabase:supabase-kt:3.1.2")
    implementation("io.github.jan-tennert.supabase:auth-kt:3.1.2")
    implementation("io.ktor:ktor-client-okhttp:3.0.2")
    implementation("io.ktor:ktor-client-content-negotiation:3.0.2")
    implementation("io.ktor:ktor-serialization-kotlinx-json:3.0.2")

    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
