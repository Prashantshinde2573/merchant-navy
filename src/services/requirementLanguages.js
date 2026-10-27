import { AVAILABLE_LANGUAGES, getUserPreferredLanguage } from './translationService.js';

const LOCALES = { en:'en-IN', hi:'hi-IN', mr:'mr-IN', es:'es-ES', fr:'fr-FR', de:'de-DE' };
export const REQUIREMENT_LANGUAGES = AVAILABLE_LANGUAGES.filter(item => LOCALES[item.code]).map(item => ({...item, locale:LOCALES[item.code]}));
const ORDER = ['en','hi','mr','es','fr','de'];
// Fixed assistant copy is local, so questions never depend on a translation request.
const ROWS = [
 ['Good morning','सुप्रभात','सुप्रभात','Buenos días','Bonjour','Guten Morgen'],
 ['Good evening','शुभ संध्या','शुभ संध्याकाळ','Buenas tardes','Bonsoir','Guten Abend'],
 ['Please describe your requirements.','कृपया अपनी आवश्यकताएं बताएं।','कृपया तुमच्या गरजा सांगा.','Describe tus necesidades, por favor.','Veuillez décrire vos besoins.','Bitte beschreibe deinen Bedarf.'],
 ['Your assistant is ready.','आपका सहायक तैयार है।','तुमचा सहाय्यक तयार आहे.','Tu asistente está listo.','Votre assistant est prêt.','Dein Assistent ist bereit.'],
 ['Couldn’t play the opening. Tap to try again or switch to Chat.','शुरुआती संदेश नहीं सुनाया जा सका। फिर कोशिश करें या चैट चुनें।','सुरुवातीचा संदेश ऐकवता आला नाही. पुन्हा प्रयत्न करा किंवा चॅट निवडा.','No se pudo reproducir el saludo. Reintenta o cambia a Chat.','Impossible de lire le message d’accueil. Réessayez ou passez au Chat.','Begrüßung konnte nicht abgespielt werden. Versuche es erneut oder wechsle zu Chat.'],
 ["Voice", "आवाज़", "आवाज", "Voz", "Voix", "Sprache"],
 ["Chat", "चैट", "चॅट", "Chat", "Chat", "Chat"],
 ["Input mode", "इनपुट मोड", "इनपुट प्रकार", "Modo de entrada", "Mode de saisie", "Eingabemodus"],
 ["Your answer", "आपका जवाब", "तुमचे उत्तर", "Tu respuesta", "Votre réponse", "Deine Antwort"],
 ["Type your answer…", "अपना जवाब लिखें…", "तुमचे उत्तर लिहा…", "Escribe tu respuesta…", "Écrivez votre réponse…", "Deine Antwort…"],
 ["Send answer", "जवाब भेजें", "उत्तर पाठवा", "Enviar respuesta", "Envoyer la réponse", "Antwort senden"],
 ["Conversation", "बातचीत", "संभाषण", "Conversación", "Conversation", "Gespräch"],
 ["Assistant", "सहायक", "सहाय्यक", "Asistente", "Assistant", "Assistent"],
 ["You", "आप", "तुम्ही", "Tú", "Vous", "Du"],
 ["End Input", "समाप्त करें", "पूर्ण करा", "Terminar", "Terminer", "Beenden"],
 ["Preparing form…", "फॉर्म तैयार हो रहा है…", "फॉर्म तयार होत आहे…", "Preparando formulario…", "Préparation du formulaire…", "Formular wird vorbereitet…"],
 ["Listening…", "सुना जा रहा है…", "ऐकत आहे…", "Escuchando…", "À l’écoute…", "Ich höre zu…"],
 ["Speaking…", "बोल रहा है…", "बोलत आहे…", "Hablando…", "En cours de lecture…", "Spricht…"],
 ["Tap to add more", "और बताने के लिए दबाएं", "आणखी सांगण्यासाठी टॅप करा", "Toca para añadir más", "Appuyez pour en ajouter", "Tippen, um mehr hinzuzufügen"],
 ["Allow microphone access to start", "शुरू करने के लिए माइक्रोफोन की अनुमति दें", "सुरू करण्यासाठी मायक्रोफोनला परवानगी द्या", "Permite el acceso al micrófono", "Autorisez le microphone", "Mikrofonzugriff erlauben"],
 ["Your request is ready to review.", "आपका अनुरोध समीक्षा के लिए तैयार है।", "तुमची विनंती तपासण्यासाठी तयार आहे.", "Tu solicitud está lista para revisar.", "Votre demande est prête à être vérifiée.", "Deine Anfrage ist zur Prüfung bereit."],
 ["See Original", "मूल देखें", "मूळ पहा", "Ver original", "Voir l’original", "Original ansehen"],
 ["See Translation", "अनुवाद देखें", "अनुवाद पहा", "Ver traducción", "Voir la traduction", "Übersetzung ansehen"],
 ["Original", "मूल", "मूळ", "Original", "Original", "Original"],
 ["Translated using AI", "AI से अनुवादित", "AI वापरून अनुवादित", "Traducido con IA", "Traduit par IA", "Mit KI übersetzt"],
 ["Home", "होम", "मुख्यपृष्ठ", "Inicio", "Accueil", "Startseite"],
 ["My Posts", "मेरी पोस्ट", "माझ्या पोस्ट", "Mis publicaciones", "Mes publications", "Meine Beiträge"],
 ["Profile", "प्रोफ़ाइल", "प्रोफाइल", "Perfil", "Profil", "Profil"],
 ["Settings", "सेटिंग्स", "सेटिंग्ज", "Ajustes", "Paramètres", "Einstellungen"],
 ["Logout", "लॉग आउट", "लॉग आउट", "Cerrar sesión", "Déconnexion", "Abmelden"],
 ["Notifications", "सूचनाएं", "सूचना", "Notificaciones", "Notifications", "Benachrichtigungen"],
 ["Talk to AI", "AI से बात करें", "AI शी बोला", "Hablar con IA", "Parler à l’IA", "Mit KI sprechen"],
 ["Post Your Requirements", "अपनी आवश्यकता पोस्ट करें", "तुमची गरज पोस्ट करा", "Publica tus necesidades", "Publiez vos besoins", "Bedarf veröffentlichen"],
 ["Couldn’t prepare your request. Your answers are safe. Try again.", "अनुरोध तैयार नहीं हुआ। आपके जवाब सुरक्षित हैं। फिर कोशिश करें।", "विनंती तयार झाली नाही. तुमची उत्तरे सुरक्षित आहेत. पुन्हा प्रयत्न करा.", "No se pudo preparar la solicitud. Tus respuestas están guardadas. Reintenta.", "Impossible de préparer la demande. Vos réponses sont conservées. Réessayez.", "Anfrage konnte nicht vorbereitet werden. Deine Antworten sind gespeichert. Versuche es erneut."],
 ["AI translation may occasionally contain errors. Please review all details before submitting.", "AI अनुवाद में कभी-कभी त्रुटियां हो सकती हैं। जमा करने से पहले सभी विवरण जांचें।", "AI अनुवादात कधीकधी चुका असू शकतात. सादर करण्यापूर्वी सर्व तपशील तपासा.", "La traducción con IA puede contener errores. Revisa todos los detalles antes de enviar.", "La traduction par IA peut contenir des erreurs. Vérifiez tous les détails avant l’envoi.", "KI-Übersetzungen können Fehler enthalten. Prüfe vor dem Absenden alle Angaben."],
 ["End Chat", "बातचीत समाप्त करें", "संभाषण समाप्त करा", "Finalizar chat", "Terminer la conversation", "Gespräch beenden"],
 ["Let’s get the details right.", "आइए विवरण पूरा करें।", "चला तपशील पूर्ण करूया.", "Completemos los detalles.", "Précisons les détails.", "Klären wir die Details."],
 ["Speak naturally. Review before publishing.", "स्वाभाविक रूप से बोलें। प्रकाशित करने से पहले जांचें।", "सहज बोला. प्रकाशित करण्यापूर्वी तपासा.", "Habla con naturalidad. Revisa antes de publicar.", "Parlez naturellement. Vérifiez avant de publier.", "Sprich ganz natürlich. Prüfe alles vor dem Veröffentlichen."],
 ['Post assistant','पोस्ट सहायक','पोस्ट सहाय्यक','Asistente de publicaciones','Assistant de publication','Beitragsassistent'],
 ['Language','भाषा','भाषा','Idioma','Langue','Sprache'],
 ['Describe your requirement','अपनी आवश्यकता बताएं','तुमची गरज सांगा','Describe lo que necesitas','Décrivez votre besoin','Beschreibe deinen Bedarf'],
 ['Tell us what you need. We’ll ask only for anything missing.','बताएं कि आपको क्या चाहिए। हम केवल बाकी जानकारी पूछेंगे।','तुम्हाला काय हवे ते सांगा. आम्ही फक्त उरलेली माहिती विचारू.','Cuéntanos qué necesitas. Solo preguntaremos lo que falte.','Dites-nous ce qu’il vous faut. Nous demanderons seulement les détails manquants.','Sag uns, was du brauchst. Wir fragen nur nach fehlenden Angaben.'],
 ['What service do you need?','आपको कौन-सी सेवा चाहिए?','तुम्हाला कोणती सेवा हवी आहे?','¿Qué servicio necesitas?','De quel service avez-vous besoin ?','Welche Dienstleistung brauchst du?'],
 ['Which port is this for?','यह किस बंदरगाह के लिए है?','हे कोणत्या बंदरासाठी आहे?','¿Para qué puerto es?','Pour quel port ?','Für welchen Hafen ist das?'],
 ['What work needs to be done?','क्या काम करवाना है?','कोणते काम करायचे आहे?','¿Qué trabajo hay que realizar?','Quel travail faut-il réaliser ?','Welche Arbeiten sind erforderlich?'],
 ['When do you need it?','आपको यह कब चाहिए?','तुम्हाला हे कधी हवे आहे?','¿Cuándo lo necesitas?','Pour quand en avez-vous besoin ?','Wann brauchst du das?'],
 ['What’s your budget?','आपका बजट कितना है?','तुमचे बजेट किती आहे?','¿Cuál es tu presupuesto?','Quel est votre budget ?','Wie hoch ist dein Budget?'],
 ['You can include more than one service.','आप एक से अधिक सेवाएं बता सकते हैं।','तुम्ही एकापेक्षा जास्त सेवा सांगू शकता.','Puedes incluir varios servicios.','Vous pouvez indiquer plusieurs services.','Du kannst mehrere Dienstleistungen angeben.'],
 ['Include all the ports you need.','सभी आवश्यक बंदरगाहों के नाम बताएं।','आवश्यक असलेल्या सर्व बंदरांची नावे सांगा.','Incluye todos los puertos necesarios.','Indiquez tous les ports concernés.','Nenne alle benötigten Häfen.'],
 ['A few clear details will help merchants quote accurately.','स्पष्ट जानकारी से व्यापारियों को सही कोटेशन देने में मदद मिलेगी।','स्पष्ट माहितीमुळे व्यापाऱ्यांना अचूक दरपत्रक देता येईल.','Los detalles claros ayudan a preparar presupuestos precisos.','Des détails clairs permettent d’établir des devis précis.','Klare Angaben helfen bei einem genauen Angebot.'],
 ['You can leave this open if your dates are flexible.','अगर तारीखें तय नहीं हैं, तो इसे छोड़ सकते हैं।','तारखा लवचिक असतील तर हे रिकामे ठेवू शकता.','Puedes omitirlo si las fechas son flexibles.','Vous pouvez passer si vos dates sont flexibles.','Bei flexiblen Terminen kannst du dies überspringen.'],
 ['No fixed budget? Choose Open to quotations.','बजट तय नहीं है? कोटेशन आमंत्रित करें चुनें।','बजेट ठरलेले नाही? दरपत्रके मागवा निवडा.','¿Sin presupuesto fijo? Elige Recibir presupuestos.','Pas de budget fixe ? Choisissez Recevoir des devis.','Kein festes Budget? Wähle Angebote anfordern.'],
 ['e.g. Fresh water supply and hull cleaning','जैसे: ताजे पानी की आपूर्ति और जहाज के पतवार की सफाई','उदा. गोड्या पाण्याचा पुरवठा आणि जहाजाच्या तळाची स्वच्छता','Ej.: suministro de agua dulce y limpieza del casco','Ex. : fourniture d’eau douce et nettoyage de coque','Z. B. Frischwasserversorgung und Rumpfreinigung'],
 ['e.g. Mumbai, Chennai or a specific anchorage','जैसे: मुंबई, चेन्नई या कोई विशेष लंगरगाह','उदा. मुंबई, चेन्नई किंवा एखादे विशिष्ट नांगरस्थान','Ej.: Mumbai, Chennai o un fondeadero específico','Ex. : Mumbai, Chennai ou un mouillage précis','Z. B. Mumbai, Chennai oder ein bestimmter Ankerplatz'],
 ['Describe the work, quantities and any special requirements.','काम, मात्रा और विशेष आवश्यकताओं की जानकारी दें।','काम, प्रमाण आणि विशेष गरजा सांगा.','Describe el trabajo, las cantidades y los requisitos especiales.','Décrivez le travail, les quantités et les exigences particulières.','Beschreibe die Arbeiten, Mengen und besonderen Anforderungen.'],
 ['e.g. Tomorrow, ASAP, or 10/11/2026 – 12/11/2026','जैसे: कल, जल्द से जल्द, या 10/11/2026 – 12/11/2026','उदा. उद्या, लवकरात लवकर किंवा 10/11/2026 – 12/11/2026','Ej.: mañana, lo antes posible o 10/11/2026 – 12/11/2026','Ex. : demain, dès que possible ou 10/11/2026 – 12/11/2026','Z. B. morgen, schnellstmöglich oder 10/11/2026 – 12/11/2026'],
 ['e.g. INR 40,000 or USD 4,000 – 5,000','जैसे: INR 40,000 या USD 4,000 – 5,000','उदा. INR 40,000 किंवा USD 4,000 – 5,000','Ej.: INR 40.000 o USD 4.000 – 5.000','Ex. : INR 40 000 ou USD 4 000 – 5 000','Z. B. INR 40.000 oder USD 4.000 – 5.000'],
 ['e.g. We need 150 MT of fresh water at Mumbai tomorrow, budget around ₹40,000.','जैसे: हमें कल मुंबई में 150 मीट्रिक टन ताजा पानी चाहिए। बजट लगभग ₹40,000 है।','उदा. आम्हाला उद्या मुंबईत 150 मेट्रिक टन गोडे पाणी हवे आहे. बजेट सुमारे ₹40,000 आहे.','Ej.: necesitamos 150 toneladas de agua dulce en Mumbai mañana, con un presupuesto de unas 40.000 rupias.','Ex. : nous avons besoin de 150 tonnes d’eau douce à Mumbai demain, pour environ 40 000 roupies.','Z. B. Wir benötigen morgen 150 Tonnen Frischwasser in Mumbai. Budget etwa 40.000 Rupien.'],
 ['Hey','नमस्ते','नमस्कार','Hola','Bonjour','Hallo'],
 ['Good afternoon','नमस्कार','शुभ दुपार','Buenas tardes','Bon après-midi','Guten Tag'],
 ['let’s get your post ready.','आइए आपकी पोस्ट तैयार करें।','चला, तुमची पोस्ट तयार करूया.','vamos a preparar tu publicación.','préparons votre publication.','erstellen wir deinen Beitrag.'],
 ['What do you need?','आपको क्या चाहिए?','तुम्हाला काय हवे आहे?','¿Qué necesitas?','De quoi avez-vous besoin ?','Was brauchst du?'],
 ['Tell me about the work, and I’ll help with the details.','काम के बारे में बताएं, मैं बाकी जानकारी भरने में मदद करूँगी।','कामाबद्दल सांगा, मी बाकी तपशील भरण्यास मदत करेन.','Cuéntame sobre el trabajo y te ayudaré con los detalles.','Décrivez le travail et je vous aiderai à préciser les détails.','Erzähl mir von den Arbeiten, und ich helfe dir mit den Details.'],
 ['Review your post','अपनी पोस्ट की समीक्षा करें','तुमची पोस्ट तपासा','Revisa tu publicación','Vérifiez votre publication','Prüfe deinen Beitrag'],
 ['Check the details. You can make final changes in the post form.','जानकारी जांचें। पोस्ट फॉर्म में अंतिम बदलाव कर सकते हैं।','तपशील तपासा. पोस्टच्या फॉर्ममध्ये अंतिम बदल करू शकता.','Comprueba los detalles. Podrás hacer cambios finales en el formulario.','Vérifiez les détails. Vous pourrez encore modifier le formulaire.','Prüfe die Angaben. Im Beitragsformular kannst du sie noch ändern.'],
 ['Service Required','आवश्यक सेवा','आवश्यक सेवा','Servicio necesario','Service demandé','Dienstleistung'],
 ['Port / Location','बंदरगाह / स्थान','बंदर / ठिकाण','Puerto / ubicación','Port / lieu','Hafen / Standort'],
 ['Scope of Work','काम का विवरण','कामाचा तपशील','Descripción del trabajo','Description des travaux','Arbeitsumfang'],
 ['Timeline & Urgency','समय और प्राथमिकता','वेळ आणि तातडी','Plazo y urgencia','Délai et urgence','Zeitraum und Dringlichkeit'],
 ['Budget Range','बजट सीमा','बजेटची मर्यादा','Presupuesto','Budget','Budgetrahmen'],
 ['Back','वापस','मागे','Atrás','Retour','Zurück'],['Continue','आगे बढ़ें','पुढे','Continuar','Continuer','Weiter'],
 ['Generate Post','पोस्ट तैयार करें','पोस्ट तयार करा','Generar publicación','Générer la publication','Beitrag erstellen'],
 ['Save answer','जवाब सहेजें','उत्तर जतन करा','Guardar respuesta','Enregistrer la réponse','Antwort speichern'],
 ['Cancel','रद्द करें','रद्द करा','Cancelar','Annuler','Abbrechen'],['Skip','छोड़ें','वगळा','Omitir','Passer','Überspringen'],
 ['Open to quotations','कोटेशन आमंत्रित करें','दरपत्रके मागवा','Recibir presupuestos','Recevoir des devis','Angebote anfordern'],
 ['Use guided questions instead','सवालों के जरिए आगे बढ़ें','प्रश्नांची उत्तरे देऊन पुढे जा','Prefiero responder preguntas','Répondre plutôt à des questions','Stattdessen Fragen beantworten'],
 ['Your answers','आपके जवाब','तुमची उत्तरे','Tus respuestas','Vos réponses','Deine Antworten'],['Edit','बदलें','बदला','Editar','Modifier','Bearbeiten'],
 ['Edit answer','जवाब बदलें','उत्तर बदला','Editar respuesta','Modifier la réponse','Antwort bearbeiten'],['Final check','अंतिम जांच','अंतिम तपासणी','Comprobación final','Dernière vérification','Letzte Prüfung'],
 ['Not specified','तय नहीं है','निश्चित नाही','Sin especificar','Non précisé','Nicht angegeben'],
 ['Nothing is published yet.','अभी कुछ भी प्रकाशित नहीं हुआ है।','अजून काहीही प्रकाशित झालेले नाही.','Todavía no se ha publicado nada.','Rien n’est encore publié.','Es wurde noch nichts veröffentlicht.'],
 ['Voice off','आवाज़ बंद','आवाज बंद','Voz desactivada','Voix désactivée','Stimme aus'],['Voice on','आवाज़ चालू','आवाज सुरू','Voz activada','Voix activée','Stimme an'],
 ['Unmute assistant voice','सहायक की आवाज़ चालू करें','सहाय्यकाचा आवाज सुरू करा','Activar la voz del asistente','Activer la voix de l’assistant','Assistentenstimme einschalten'],
 ['Mute assistant voice','सहायक की आवाज़ बंद करें','सहाय्यकाचा आवाज बंद करा','Silenciar al asistente','Couper la voix de l’assistant','Assistentenstimme stummschalten'],
 ['Listen','सुनें','ऐका','Escuchar','Écouter','Anhören'],['Listen to post','पोस्ट सुनें','पोस्ट ऐका','Escuchar publicación','Écouter la publication','Beitrag anhören'],
 ['Listen to this question','यह सवाल सुनें','हा प्रश्न ऐका','Escuchar esta pregunta','Écouter cette question','Diese Frage anhören'],
 ['Listen to post preview','पोस्ट का पूर्वावलोकन सुनें','पोस्टचे पूर्वावलोकन ऐका','Escuchar la vista previa','Écouter l’aperçu','Beitragsvorschau anhören'],
 ['Stop reading','पढ़ना रोकें','वाचन थांबवा','Detener lectura','Arrêter la lecture','Vorlesen stoppen'],['Stop reading aloud','आवाज़ में पढ़ना रोकें','मोठ्याने वाचन थांबवा','Detener lectura en voz alta','Arrêter la lecture vocale','Vorlesen beenden'],
 ['Reading aloud…','पढ़ा जा रहा है…','वाचन सुरू आहे…','Leyendo…','Lecture en cours…','Wird vorgelesen…'],['Preparing voice…','आवाज़ तैयार हो रही है…','आवाज तयार होत आहे…','Preparando la voz…','Préparation de la voix…','Stimme wird vorbereitet…'],
 ['Tap Listen to play the voice-over.','आवाज़ सुनने के लिए सुनें दबाएं।','आवाज ऐकण्यासाठी ऐका दाबा.','Toca Escuchar para reproducir la voz.','Appuyez sur Écouter pour lancer la voix.','Tippe auf Anhören, um die Stimme abzuspielen.'],
 ['Device voice','डिवाइस की आवाज़','डिव्हाइसचा आवाज','Voz del dispositivo','Voix de l’appareil','Gerätestimme'],
 ['Tap to talk','बात करने के लिए दबाएं','बोलण्यासाठी टॅप करा','Toca para hablar','Appuyez pour parler','Zum Sprechen tippen'],
 ['Tap to try again','फिर कोशिश करने के लिए दबाएं','पुन्हा प्रयत्न करण्यासाठी टॅप करा','Toca para reintentar','Appuyez pour réessayer','Zum Wiederholen tippen'],
 ['Type instead','टाइप करें','त्याऐवजी टाइप करा','Escribir en su lugar','Écrire plutôt','Stattdessen tippen'],
 ['Talk to the assistant','सहायक से बात करें','सहाय्यकाशी बोला','Hablar con el asistente','Parler à l’assistant','Mit dem Assistenten sprechen'],
 ['Interrupt and answer','रोकें और जवाब दें','थांबवून उत्तर द्या','Interrumpir y responder','Interrompre et répondre','Unterbrechen und antworten'],
 ['Review your answer, then tap to continue','जवाब जांचें, फिर आगे बढ़ने के लिए दबाएं','उत्तर तपासा, नंतर पुढे जाण्यासाठी टॅप करा','Revisa tu respuesta y toca para continuar','Vérifiez votre réponse, puis appuyez pour continuer','Antwort prüfen und zum Fortfahren tippen'],
 ['Your microphone starts after the question. Review each answer before continuing.','सवाल के बाद माइक्रोफोन चालू होगा। आगे बढ़ने से पहले जवाब जांचें।','प्रश्नानंतर मायक्रोफोन सुरू होतो. पुढे जाण्यापूर्वी उत्तर तपासा.','El micrófono se activa después de la pregunta. Revisa cada respuesta antes de continuar.','Le microphone démarre après la question. Vérifiez chaque réponse avant de continuer.','Das Mikrofon startet nach der Frage. Prüfe jede Antwort, bevor du fortfährst.'],
 ['Female voice','महिला आवाज़','स्त्री आवाज','Voz femenina','Voix féminine','Weibliche Stimme'],['Natural female voice','स्वाभाविक महिला आवाज़','नैसर्गिक स्त्री आवाज','Voz femenina natural','Voix féminine naturelle','Natürliche weibliche Stimme'],
 ['Speak','बोलें','बोला','Hablar','Parler','Sprechen'],['Speak your answer','अपना जवाब बोलें','तुमचे उत्तर बोला','Dictar respuesta','Dicter votre réponse','Antwort diktieren'],
 ['Stop voice input','बोलकर जवाब देना रोकें','आवाजी उत्तर थांबवा','Detener dictado','Arrêter la dictée','Diktat stoppen'],['Stop','रोकें','थांबवा','Detener','Arrêter','Stopp'],
 ['Processing','तैयार हो रहा है','प्रक्रिया सुरू आहे','Procesando','Traitement','Verarbeitung'],['Cancel recording','रिकॉर्डिंग रद्द करें','रेकॉर्डिंग रद्द करा','Cancelar grabación','Annuler l’enregistrement','Aufnahme abbrechen'],
 ['Type or use the microphone.','टाइप करें या माइक्रोफोन इस्तेमाल करें।','टाइप करा किंवा मायक्रोफोन वापरा.','Escribe o utiliza el micrófono.','Écrivez ou utilisez le microphone.','Tippe oder nutze das Mikrofon.'],
 ['Allow microphone access in your browser to start. Tap again to cancel.','शुरू करने के लिए माइक्रोफोन की अनुमति दें। रद्द करने के लिए फिर दबाएं।','सुरू करण्यासाठी मायक्रोफोनची परवानगी द्या. रद्द करण्यासाठी पुन्हा दाबा.','Permite el micrófono para empezar. Pulsa de nuevo para cancelar.','Autorisez le microphone pour commencer. Appuyez à nouveau pour annuler.','Erlaube den Mikrofonzugriff. Zum Abbrechen erneut tippen.'],
 ['Listening… Tap stop when you’re finished.','सुना जा रहा है… बोलने के बाद रोकें दबाएं।','ऐकत आहे… बोलून झाल्यावर थांबवा दाबा.','Escuchando… Pulsa Detener al terminar.','À l’écoute… Appuyez sur Arrêter lorsque vous avez terminé.','Ich höre zu… Tippe auf Stopp, wenn du fertig bist.'],
 ['Finishing transcription…','आवाज़ को टेक्स्ट में बदला जा रहा है…','आवाजाचे मजकुरात रूपांतर होत आहे…','Finalizando la transcripción…','Finalisation de la transcription…','Transkription wird abgeschlossen…'],
 ['Review or edit your answer, then continue.','अपना जवाब जांचें या बदलें, फिर आगे बढ़ें।','उत्तर तपासा किंवा बदला, मग पुढे जा.','Revisa o edita tu respuesta y continúa.','Vérifiez ou modifiez votre réponse, puis continuez.','Prüfe oder ändere deine Antwort und fahre fort.'],
 ['Voice input is unavailable in this browser. You can type your answer.','इस ब्राउज़र में बोलकर जवाब नहीं दे सकते। अपना जवाब टाइप करें।','या ब्राउझरमध्ये आवाजी उत्तर उपलब्ध नाही. उत्तर टाइप करा.','El dictado no está disponible. Puedes escribir tu respuesta.','La dictée n’est pas disponible. Vous pouvez écrire votre réponse.','Diktat ist nicht verfügbar. Du kannst deine Antwort tippen.'],
 ['Read aloud is unavailable in this browser.','इस ब्राउज़र में आवाज़ में पढ़ना उपलब्ध नहीं है।','या ब्राउझरमध्ये वाचनाची सोय उपलब्ध नाही.','La lectura en voz alta no está disponible.','La lecture vocale n’est pas disponible.','Vorlesen ist in diesem Browser nicht verfügbar.'],
 ['Tell us a little about the work you need.','आपको जो काम करवाना है, उसके बारे में थोड़ा बताएं।','तुम्हाला करायच्या कामाबद्दल थोडे सांगा.','Cuéntanos un poco sobre el trabajo que necesitas.','Décrivez brièvement le travail à réaliser.','Beschreibe kurz die benötigten Arbeiten.'],
 ['Please describe the work before continuing.','आगे बढ़ने से पहले काम का विवरण दें।','पुढे जाण्यापूर्वी कामाचा तपशील द्या.','Describe el trabajo antes de continuar.','Décrivez le travail avant de continuer.','Beschreibe die Arbeiten, bevor du fortfährst.'],
 ['Add an answer, or choose the option to leave it open.','जवाब दें, या इसे छोड़ने का विकल्प चुनें।','उत्तर द्या किंवा रिकामे ठेवण्याचा पर्याय निवडा.','Añade una respuesta o elige dejarlo abierto.','Ajoutez une réponse ou choisissez de passer.','Gib eine Antwort ein oder lasse die Angabe offen.'],
 ['Enter an amount or range, such as INR 40,000 – 50,000.','राशि या सीमा लिखें, जैसे INR 40,000 – 50,000।','रक्कम किंवा मर्यादा लिहा, उदा. INR 40,000 – 50,000.','Introduce una cantidad o un intervalo, por ejemplo INR 40.000 – 50.000.','Indiquez un montant ou une fourchette, par exemple INR 40 000 – 50 000.','Gib einen Betrag oder Bereich ein, z. B. INR 40.000 – 50.000.'],
 ['Translating…','अनुवाद हो रहा है…','भाषांतर होत आहे…','Traduciendo…','Traduction…','Wird übersetzt…'],
 ['Translation failed. Your answers are safe. Retry or choose another language.','अनुवाद नहीं हो पाया। आपके जवाब सुरक्षित हैं। फिर कोशिश करें या दूसरी भाषा चुनें।','भाषांतर झाले नाही. तुमची उत्तरे सुरक्षित आहेत. पुन्हा प्रयत्न करा किंवा दुसरी भाषा निवडा.','No se pudo traducir. Tus respuestas están guardadas. Reintenta o elige otro idioma.','La traduction a échoué. Vos réponses sont conservées. Réessayez ou choisissez une autre langue.','Die Übersetzung ist fehlgeschlagen. Deine Antworten bleiben erhalten. Versuche es erneut oder wähle eine andere Sprache.'],
 ['Retry translation','अनुवाद फिर करें','भाषांतर पुन्हा करा','Reintentar traducción','Réessayer la traduction','Übersetzung wiederholen'],
 ['No recognised female voice is available for this language. You can continue with text.','इस भाषा में महिला आवाज़ उपलब्ध नहीं है। टेक्स्ट के साथ आगे बढ़ सकते हैं।','या भाषेसाठी स्त्री आवाज उपलब्ध नाही. मजकुरासह पुढे जाऊ शकता.','No hay una voz femenina reconocida para este idioma. Puedes continuar con texto.','Aucune voix féminine reconnue n’est disponible pour cette langue. Vous pouvez continuer avec le texte.','Für diese Sprache ist keine erkannte weibliche Stimme verfügbar. Du kannst mit Text fortfahren.'],
 ['Couldn’t play the voice-over. Try Listen again, or continue with the text.','आवाज़ नहीं चल पाई। फिर सुनें दबाएं या टेक्स्ट के साथ आगे बढ़ें।','आवाज सुरू झाला नाही. पुन्हा ऐका दाबा किंवा मजकुरासह पुढे जा.','No se pudo reproducir la voz. Intenta Escuchar de nuevo o continúa con texto.','Impossible de lire la voix. Réessayez Écouter ou continuez avec le texte.','Die Sprachausgabe konnte nicht gestartet werden. Versuche Anhören erneut oder fahre mit Text fort.'],
 ['Microphone access was denied. Allow it in your browser settings, or type your answer.','माइक्रोफोन की अनुमति नहीं मिली। ब्राउज़र सेटिंग में अनुमति दें या जवाब टाइप करें।','मायक्रोफोनची परवानगी नाकारली. ब्राउझर सेटिंगमध्ये परवानगी द्या किंवा उत्तर टाइप करा.','Se denegó el acceso al micrófono. Actívalo en el navegador o escribe la respuesta.','L’accès au microphone a été refusé. Autorisez-le dans le navigateur ou écrivez votre réponse.','Der Mikrofonzugriff wurde verweigert. Erlaube ihn im Browser oder tippe deine Antwort.'],
 ['No speech detected. Try the microphone again or type your answer.','आवाज़ नहीं सुनाई दी। फिर बोलें या जवाब टाइप करें।','आवाज ऐकू आला नाही. पुन्हा बोला किंवा उत्तर टाइप करा.','No se detectó voz. Prueba el micrófono de nuevo o escribe la respuesta.','Aucune voix détectée. Réessayez le microphone ou écrivez votre réponse.','Keine Sprache erkannt. Versuche es erneut oder tippe deine Antwort.']
];
export function requirementLocale(language = 'en') { return LOCALES[language] || LOCALES.en; }
export function requirementCopy(text, language = 'en') {
  const row = ROWS.find(item => item[0] === text);
  return row?.[ORDER.indexOf(language)] || text;
}
export function preferredRequirementLanguage() {
  try {
    const saved = localStorage.getItem('merchant_navy_ai_language') || getUserPreferredLanguage();
    return LOCALES[saved] ? saved : 'en';
  } catch { return 'en'; }
}
export function saveRequirementLanguage(language) {
  if (!LOCALES[language]) return;
  try { localStorage.setItem('merchant_navy_ai_language', language); } catch { /* Private browsing can disable storage. */ }
}
export function questionCount(current, total, language) {
  const labels = {en:`Question ${current} of ${total}`,hi:`प्रश्न ${current} / ${total}`,mr:`प्रश्न ${current} / ${total}`,es:`Pregunta ${current} de ${total}`,fr:`Question ${current} sur ${total}`,de:`Frage ${current} von ${total}`};
  return labels[language] || labels.en;
}
export function validateRequirementCopy() { return ROWS.every(row => row.length === ORDER.length && row.every(value => typeof value === 'string' && value.length)); }

const SERVICES = [
 ['Ship Chandlering','जहाज की रसद आपूर्ति','जहाजासाठी सामग्री पुरवठा','Suministros para buques','Avitaillement du navire','Schiffsausrüstung'],
 ['Bunker Supply','जहाज के ईंधन की आपूर्ति','जहाजासाठी इंधन पुरवठा','Suministro de combustible','Fourniture de combustible','Bunkerversorgung'],
 ['Fresh Water Supply','ताजे पानी की आपूर्ति','गोड्या पाण्याचा पुरवठा','Suministro de agua dulce','Fourniture d’eau douce','Frischwasserversorgung'],
 ['Underwater Hull Cleaning','पानी के नीचे जहाज के पतवार की सफाई','पाण्याखाली जहाजाच्या तळाची स्वच्छता','Limpieza submarina del casco','Nettoyage sous-marin de coque','Unterwasser-Rumpfreinigung'],
 ['Propeller Polishing','प्रोपेलर की पॉलिशिंग','प्रोपेलर पॉलिशिंग','Pulido de hélices','Polissage d’hélice','Propellerpolieren'],
 ['Waste Disposal','कचरे का निपटान','कचरा विल्हेवाट','Gestión de residuos','Élimination des déchets','Abfallentsorgung'],
 ['Crew Transfer','चालक दल का स्थानांतरण','कर्मचारी वाहतूक','Traslado de tripulación','Transfert d’équipage','Besatzungstransfer'],
 ['Canal Transit Agency Support','नहर पारगमन एजेंसी सहायता','कालवा पारगमन संस्था सहाय्य','Asistencia para el tránsito por canales','Assistance au transit par canal','Unterstützung bei Kanaltransit'],
 ['Cash to Master (CTM) Coordination','कप्तान को नकद देने का समन्वय','कॅप्टनला रोख रक्कम देण्यासाठी समन्वय','Coordinación de efectivo al capitán','Coordination des fonds au capitaine','Bargeldkoordination für den Kapitän'],
 ['Compressed Air Utility','संपीड़ित वायु सेवा','दाबयुक्त हवा सेवा','Servicio de aire comprimido','Service d’air comprimé','Druckluftversorgung'],
 ['Sea Chest Grating Inspection','समुद्री जल प्रवेश जाली का निरीक्षण','समुद्री पाणी प्रवेश जाळीची तपासणी','Inspección de rejillas de toma de mar','Inspection des grilles de prise d’eau','Inspektion der Seekastenroste'],
 ['Zinc Anode Inspection','जिंक एनोड का निरीक्षण','झिंक अॅनोड तपासणी','Inspección de ánodos de zinc','Inspection des anodes de zinc','Inspektion der Zinkanoden']
];
export function localizedRequirementService(value, language) {
  return SERVICES.find(row => row[0] === value)?.[ORDER.indexOf(language)] || value;
}
export function canonicalRequirementServices(text, language) {
  const parts = text.split(/[,;\n]+/).map(value=>value.trim()).filter(Boolean);
  const values = parts.map(value=>SERVICES.find(row=>row[ORDER.indexOf(language)]?.toLowerCase()===value.toLowerCase())?.[0]);
  return values.length && values.every(Boolean) ? values.join(', ') : null;
}
export function normalizeRequirementDigits(text) {
  return text.replace(/[०-९٠-٩۰-۹]/g,char=>String(char.charCodeAt(0)-(char>='०'&&char<='९'?0x966:char>='٠'&&char<='٩'?0x660:0x6f0)));
}
export function normalizeRequirementNumbers(text, language) {
  let value = normalizeRequirementDigits(text);
  if (['es','de'].includes(language)) value = value.replace(/(\d)\.(?=\d{3}(?:\D|$))/g, '$1');
  if (language === 'fr') value = value.replace(/(\d)[\u00a0\u202f ](?=\d{3}(?:\D|$))/g, '$1');
  if (['es','fr','de'].includes(language)) value = value.replace(/(\d),(?=\d{1,2}(?:\D|$))/g, '$1.');
  return value;
}
export function requirementCurrencyHint(text) {
  const currencies = [
    ['INR',/₹|\bINR\b|\b(?:Indian rupees?|rupees?|rupias?|roupies?|Rupien)\b|रुपय|रुपये|रुपयों/i],
    ['USD',/\$|\bUSD\b|\b(?:US dollars?|dólares estadounidenses|dollars américains|US-Dollar)\b|डॉलर/i],
    ['EUR',/€|\b(?:EUR|euros?)\b|यूरो|युरो/i],
    ['GBP',/£|\b(?:GBP|pounds?|livres sterling|libras esterlinas|Pfund)\b|पाउंड/i],
    ['AED',/\b(?:AED|dirhams?)\b|दिरहम/i]
  ].filter(([,pattern])=>pattern.test(text));
  return currencies.length===1 ? currencies[0][0] : null;
}
const PORTS = {
  'Chennai':'चेन्नई','Mumbai':'मुंबई','Visakhapatnam (Vizag)':'विशाखापट्टनम (विजाग)','Cochin':'कोचीन','Kolkata':'कोलकाता','Jawaharlal Nehru Port (JNPT)':'जवाहरलाल नेहरू बंदरगाह (जेएनपीटी)','Kandla':'कांडला','Paradip':'पारादीप','Tuticorin':'तूतीकोरिन','Mormugao':'मोरमुगाओ','Mangalore':'मंगलुरु','Dubai (UAE)':'दुबई (यूएई)','Singapore':'सिंगापुर','Rotterdam':'रॉटरडैम','Fujairah':'फुजैरा'
};
export function localizedRequirementPort(value, language) {
  return ['hi','mr'].includes(language) ? PORTS[value] || value : value;
}
export function canonicalRequirementPorts(text) {
  const parts=text.split(/[,;\n]+/).map(value=>value.trim()).filter(Boolean);
  const values=parts.map(value=>Object.entries(PORTS).find(([key,native])=>key.toLowerCase()===value.toLowerCase() || native===value)?.[0]);
  return values.length && values.every(Boolean) ? values.join(', ') : null;
}
