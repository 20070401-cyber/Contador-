import { KotlinFile } from '../types';

export const KOTLIN_CODEBASE: KotlinFile[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/racha/app/MainActivity.kt',
    language: 'kotlin',
    description: 'Actividad principal y pantalla completa Jetpack Compose (UI en modo oscuro con colores neón).',
    content: `package com.racha.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.racha.app.ui.theme.*

class MainActivity : ComponentActivity() {
    private val viewModel: RachaViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RachaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = NeonOledBackground
                ) {
                    RachaScreen(viewModel = viewModel)
                }
            }
        }
    }
}

/**
 * Pantalla única de RACHA en Jetpack Compose.
 * Modo oscuro puro, colores neón de alto impacto y funcionamiento 100% offline.
 */
@Composable
fun RachaScreen(viewModel: RachaViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val haptic = LocalHapticFeedback.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NeonOledBackground)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(horizontal = 20.dp, vertical = 16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // 1. Encabezado de la App
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "RACHA",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Black,
                    color = NeonGreen,
                    letterSpacing = 3.sp
                )
                Text(
                    text = "HÁBITO DE ESTUDIO DIARIO",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF64748B),
                    letterSpacing = 1.sp
                )
            }

            // Indicador Offline / Sin Anuncios
            Surface(
                color = Color(0xFF131722),
                shape = RoundedCornerShape(8.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E2638))
            ) {
                Text(
                    text = "100% OFFLINE",
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = NeonCyan
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // 2. Contador Gigante de Días Consecutivos (Hero Metric)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .shadow(
                    elevation = 20.dp,
                    shape = RoundedCornerShape(24.dp),
                    spotColor = NeonGreen.copy(alpha = 0.25f)
                )
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF131722), Color(0xFF0E111A))
                    ),
                    shape = RoundedCornerShape(24.dp)
                )
                .border(
                    width = 1.5.dp,
                    brush = Brush.horizontalGradient(
                        colors = listOf(NeonGreen.copy(alpha = 0.6f), NeonCyan.copy(alpha = 0.4f))
                    ),
                    shape = RoundedCornerShape(24.dp)
                )
                .padding(vertical = 32.dp, horizontal = 20.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "🔥",
                    fontSize = 32.sp
                )

                // Número gigante animado
                AnimatedContent(
                    targetState = uiState.streakCount,
                    transitionSpec = {
                        slideInVertically { height -> height } + fadeIn() togetherWith
                        slideOutVertically { height -> -height } + fadeOut()
                    },
                    label = "streakCounter"
                ) { targetStreak ->
                    Text(
                        text = "$targetStreak",
                        fontSize = 80.sp,
                        fontWeight = FontWeight.Black,
                        color = NeonGreen,
                        lineHeight = 84.sp
                    )
                }

                Text(
                    text = if (uiState.streakCount == 1) "DÍA CONSECUTIVO" else "DÍAS CONSECUTIVOS",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF94A3B8),
                    letterSpacing = 2.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Estado de racha de hoy
                Text(
                    text = if (uiState.hasStudiedToday) "✓ Racha asegurada hoy" else "Pendiente de estudiar hoy",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = if (uiState.hasStudiedToday) NeonCyan else Color(0xFFFFB300)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 3. Botón Táctil Neón «Hoy sí estudié»
        val isAlreadyDone = uiState.hasStudiedToday
        Button(
            onClick = {
                if (!isAlreadyDone) {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    viewModel.onStudyTodayClicked()
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp)
                .shadow(
                    elevation = if (!isAlreadyDone) 16.dp else 4.dp,
                    shape = RoundedCornerShape(18.dp),
                    spotColor = NeonGreen
                ),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (isAlreadyDone) Color(0xFF1E293B) else NeonGreen,
                contentColor = if (isAlreadyDone) Color(0xFF94A3B8) else Color(0xFF090A0F)
            ),
            shape = RoundedCornerShape(18.dp),
            contentPadding = PaddingValues(0.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                if (isAlreadyDone) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Completado",
                        tint = NeonCyan,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "¡HOY YA ESTUDIASTE!",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp,
                        color = NeonCyan
                    )
                } else {
                    Text(
                        text = "⚡",
                        fontSize = 20.sp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "HOY SÍ ESTUDIÉ",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp,
                        color = Color(0xFF051B11)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // 4. Lista de los Últimos Siete Días
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF131722), shape = RoundedCornerShape(20.dp))
                .border(1.dp, Color(0xFF1E2638), shape = RoundedCornerShape(20.dp))
                .padding(16.dp)
        ) {
            Text(
                text = "ÚLTIMOS 7 DÍAS",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF94A3B8),
                letterSpacing = 1.5.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Fila de los 7 días
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                uiState.lastSevenDays.forEach { dayRecord ->
                    DayItem(dayRecord = dayRecord)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 5. Mensaje Motivador Distinto Cada Vez
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = Color(0xFF10141E),
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF222C44))
        ) {
            Column(
                modifier = Modifier.padding(18.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "MENSAJE MOTIVADOR",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeonAmber,
                        letterSpacing = 1.sp
                    )

                    IconButton(
                        onClick = { viewModel.refreshQuote() },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Nuevo mensaje",
                            tint = Color(0xFF64748B),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                AnimatedContent(
                    targetState = uiState.currentQuote,
                    transitionSpec = { fadeIn() togetherWith fadeOut() },
                    label = "quoteChange"
                ) { quote ->
                    Text(
                        text = "«\${quote.text}»",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFFE2E8F0),
                        lineHeight = 22.sp
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "— \${uiState.currentQuote.author}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = NeonGreen
                )
            }
        }
    }
}

/**
 * Item individual para cada uno de los últimos 7 días.
 */
@Composable
fun DayItem(dayRecord: DayUiModel) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(horizontal = 2.dp)
    ) {
        Text(
            text = dayRecord.dayLetter,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = if (dayRecord.isToday) NeonGreen else Color(0xFF64748B)
        )

        Spacer(modifier = Modifier.height(6.dp))

        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(
                    when {
                        dayRecord.wasStudied -> NeonGreen.copy(alpha = 0.18f)
                        dayRecord.isToday -> Color(0xFF1E293B)
                        else -> Color(0xFF171B26)
                    }
                )
                .border(
                    width = if (dayRecord.isToday) 1.5.dp else 1.dp,
                    color = when {
                        dayRecord.wasStudied -> NeonGreen
                        dayRecord.isToday -> NeonCyan
                        else -> Color(0xFF263047)
                    },
                    shape = CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            if (dayRecord.wasStudied) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = "Estudiado",
                    tint = NeonGreen,
                    modifier = Modifier.size(18.dp)
                )
            } else {
                Text(
                    text = "\${dayRecord.dayNumber}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (dayRecord.isToday) Color.White else Color(0xFF64748B)
                )
            }
        }
    }
}
`
  },
  {
    name: 'RachaViewModel.kt',
    path: 'app/src/main/java/com/racha/app/RachaViewModel.kt',
    language: 'kotlin',
    description: 'Gestión de estado reactivo, lógica de cálculo de rachas consecutivas y persistencia con DataStore.',
    content: `package com.racha.app

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.racha.app.data.StudyDataStore
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.TextStyle
import java.util.Locale

data class Quote(val text: String, val author: String)

data class DayUiModel(
    val dateString: String,
    val dayLetter: String,
    val dayNumber: Int,
    val wasStudied: Boolean,
    val isToday: Boolean
)

data class RachaUiState(
    val streakCount: Int = 0,
    val hasStudiedToday: Boolean = false,
    val lastSevenDays: List<DayUiModel> = emptyList(),
    val currentQuote: Quote = Quote(
        text = "La disciplina tarde o temprano vencerá a la inteligencia.",
        author = "Kenji Orito Yokoi"
    )
)

class RachaViewModel(application: Application) : AndroidViewModel(application) {
    private val dataStore = StudyDataStore(application)

    private val quotesList = listOf(
        Quote("La disciplina tarde o temprano vencerá a la inteligencia.", "Kenji Orito Yokoi"),
        Quote("No estudias para aprobar un examen, estudias para construir tu libertad.", "Enfoque RACHA"),
        Quote("El interés compuesto del conocimiento rinde los mayores beneficios.", "Benjamin Franklin"),
        Quote("Un día a la vez. Cada hora de concentración forja la mente que querés tener.", "Hábitos"),
        Quote("Somos lo que hacemos día tras día. La excelencia no es un acto, es un hábito.", "Aristóteles"),
        Quote("La motivación te pone en marcha, pero la racha te mantiene en el camino.", "Jim Ryun"),
        Quote("Cuando sientas que querés aflojar, recordá por qué empezaste este viaje.", "Resiliencia"),
        Quote("Pequeñas victorias diarias acumuladas producen resultados colosales.", "Robin Sharma"),
        Quote("El dolor de la disciplina pesa gramos; el dolor del arrepentimiento pesa toneladas.", "Jim Rohn"),
        Quote("Hoy diste el paso que el 90% postergó para el lunes. Tu racha habla por vos.", "Comunidad RACHA")
    )

    private val _currentQuote = MutableStateFlow(quotesList.random())

    val uiState: StateFlow<RachaUiState> = combine(
        dataStore.studiedDatesFlow,
        _currentQuote
    ) { studiedDates, quote ->
        val today = LocalDate.now()
        val todayStr = today.toString()
        val hasToday = studiedDates.contains(todayStr)

        // Cálculo de racha consecutiva
        val streak = calculateStreak(studiedDates, today)

        // Construir los últimos 7 días
        val lastSeven = (6 downTo 0).map { offset ->
            val date = today.minusDays(offset.toLong())
            val dateStr = date.toString()
            val dayName = date.dayOfWeek.getDisplayName(TextStyle.SHORT, Locale("es", "ES")).uppercase()
            DayUiModel(
                dateString = dateStr,
                dayLetter = dayName.take(3),
                dayNumber = date.dayOfMonth,
                wasStudied = studiedDates.contains(dateStr),
                isToday = offset == 0
            )
        }

        RachaUiState(
            streakCount = streak,
            hasStudiedToday = hasToday,
            lastSevenDays = lastSeven,
            currentQuote = quote
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = RachaUiState()
    )

    fun onStudyTodayClicked() {
        viewModelScope.launch {
            val todayStr = LocalDate.now().toString()
            dataStore.recordStudyDay(todayStr)
            refreshQuote()
        }
    }

    fun refreshQuote() {
        val current = _currentQuote.value
        val filtered = quotesList.filter { it != current }
        _currentQuote.value = filtered.random()
    }

    private fun calculateStreak(studiedDates: Set<String>, today: LocalDate): Int {
        if (studiedDates.isEmpty()) return 0

        val todayStr = today.toString()
        val yesterdayStr = today.minusDays(1).toString()

        val hasToday = studiedDates.contains(todayStr)
        val hasYesterday = studiedDates.contains(yesterdayStr)

        if (!hasToday && !hasYesterday) {
            return 0
        }

        var count = 0
        var cursor = if (hasToday) today else today.minusDays(1)

        while (studiedDates.contains(cursor.toString())) {
            count++
            cursor = cursor.minusDays(1)
        }

        return count
    }
}
`
  },
  {
    name: 'StudyDataStore.kt',
    path: 'app/src/main/java/com/racha/app/data/StudyDataStore.kt',
    language: 'kotlin',
    description: 'Persistencia 100% local en el teléfono utilizando Jetpack DataStore Preferences (sin base de datos externa ni internet).',
    content: `package com.racha.app.data

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "racha_preferences")

class StudyDataStore(private val context: Context) {
    companion object {
        val KEY_STUDIED_DATES = stringSetPreferencesKey("key_studied_dates")
    }

    val studiedDatesFlow: Flow<Set<String>> = context.dataStore.data.map { preferences ->
        preferences[KEY_STUDIED_DATES] ?: emptySet()
    }

    suspend fun recordStudyDay(dateIso: String) {
        context.dataStore.edit { preferences ->
            val current = preferences[KEY_STUDIED_DATES] ?: emptySet()
            preferences[KEY_STUDIED_DATES] = current + dateIso
        }
    }

    suspend fun clearHistory() {
        context.dataStore.edit { preferences ->
            preferences[KEY_STUDIED_DATES] = emptySet()
        }
    }
}
`
  },
  {
    name: 'RachaTheme.kt',
    path: 'app/src/main/java/com/racha/app/ui/theme/RachaTheme.kt',
    language: 'kotlin',
    description: 'Paleta Material 3 en modo oscuro OLED puro con colores neón (verde eléctrico, cian y ámbar).',
    content: `package com.racha.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Paleta Neón sobre fondo oscuro OLED
val NeonOledBackground = Color(0xFF090A0F)
val NeonCardSurface = Color(0xFF131722)
val NeonGreen = Color(0xFF00E676)       // Verde eléctrico para el contador y botón
val NeonCyan = Color(0xFF00E5FF)        // Cian brillante para acentos secundarios
val NeonAmber = Color(0xFFFFB300)       // Ámbar neón para avisos y citas
val NeonTextPrimary = Color(0xFFF8FAFC)
val NeonTextMuted = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = NeonGreen,
    secondary = NeonCyan,
    tertiary = NeonAmber,
    background = NeonOledBackground,
    surface = NeonCardSurface,
    onPrimary = Color(0xFF051B11),
    onBackground = NeonTextPrimary,
    onSurface = NeonTextPrimary
)

@Composable
fun RachaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Manifiesto de la app Android sin permiso de internet (100% offline, privada y sin librerías de publicidad).',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- CERO PERMISOS DE INTERNET: Sin anuncios, sin rastreo y 100% offline -->
    <!-- Solo vibración para feedback táctil háptico al presionar el botón -->
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="RACHA"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:theme="@android:style/Theme.Material.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Archivo de configuración Gradle con Jetpack Compose y DataStore Preferences.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.racha.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.racha.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    
    // DataStore para persistencia local de la racha sin internet
    implementation("androidx.datastore:datastore-preferences:1.1.1")
}
`
  }
];
