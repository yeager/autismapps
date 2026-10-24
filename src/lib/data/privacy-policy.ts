export interface PrivacyPolicyItem {
  name: string;
  description: string;
  detail?: string;
  link?: string;
  url?: string;
}

export interface PrivacyPolicySection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  items?: PrivacyPolicyItem[];
  showContactLink?: boolean;
}

export interface PrivacyPolicy {
  title: string;
  intro: string;
  sections: PrivacyPolicySection[];
  contact: { prefix: string; email: string; suffix: string };
}

export const PRIVACY_POLICIES: Record<string, PrivacyPolicy> = {
  en: {
    title: 'Privacy policy',
    intro: 'How information is handled on the website and in the apps.',
    sections: [
      {
        title: 'Information processed when you visit the website',
        paragraphs: [
          'When a page is requested, the web host processes technical information such as your IP address, browser and device type, the page requested, and the time. The site owner has disabled the web host’s standard access logging for these domains. Page visits are therefore not saved in the hosting account’s access logs through that feature. This does not rule out separate operational or security logs maintained by the provider, or processing by external services. The website has no accounts and does not ask for your name.'
        ]
      },
      {
        title: 'External content services',
        items: [
          {
            name: 'ARASAAC',
            description: 'Some tools use pictograms from ARASAAC. When you search for a pictogram, the search term and selected language are sent to ARASAAC’s API. ARASAAC says that API use by third-party apps is not stored per user; only anonymous, aggregated statistics per app are kept. A network request still contains your IP address and the requested resource so the service can respond.',
            link: 'ARASAAC privacy policy',
            url: 'https://arasaac.org/privacy-policy'
          },
          {
            name: 'Swedish Sign Language Dictionary',
            description: 'The dictionary at Stockholm University provides search results, images, and videos. When you search, the search term is sent to its website. Technical information needed to answer the request, such as your IP address and the page or file requested, is also processed. Stockholm University has told us that it does not store personal data.',
            link: 'Visit the dictionary',
            url: 'https://teckensprakslexikon.su.se'
          },
          {
            name: 'Hugging Face',
            description: 'Hugging Face automatically receives usage and session information (date and location), your IP address, and your device type and version, operating system, and browser. Its privacy policy says this information may be used to provide, operate, and improve the service, analyze usage, troubleshoot, and maintain security. It is kept as long as needed for the service, legal requirements, security, and legitimate interests; no fixed retention period is specified.',
            detail: 'Text you enter for speech is not sent to Hugging Face.',
            link: 'Hugging Face privacy policy',
            url: 'https://huggingface.co/privacy'
          },
          {
            name: 'jsDelivr',
            description: 'jsDelivr delivers some program files. Its data processing agreement lists IP address, browser type and version, referring domain, requested CDN address, time, and diagnostic information. The agreement describes ongoing processing but does not specify a fixed retention period.',
            link: 'jsDelivr data processing agreement',
            url: 'https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net'
          }
        ],
        paragraphs: [
          'Opening an external link sends a normal request to the website you chose. Those services handle information under their own terms and privacy policies.'
        ]
      },
      {
        title: 'Information stored on your device',
        bullets: [
          'Language and settings are stored in your browser’s localStorage.',
          'Schedules, choices, and some material you create are stored by each tool in localStorage or IndexedDB.',
          'The service worker may cache app files so installed web apps can work offline.'
        ],
        paragraphs: [
          'Content stored locally through these features does not leave your device. Clear the website’s data in your browser settings to remove it. Uninstalling a PWA may also remove the browser’s stored data.'
        ]
      },
      {
        title: 'The iPad app',
        paragraphs: [
          'The app’s built-in schedule and choice board store their content on your device. The app has no sign-in, advertising, or analytics tools. Its tools, pictograms, and materials tabs show the website and use the external services described above. On iPad, the app uses the device’s built-in speech; it does not download voice models. Internet access is required for website content.'
        ]
      },
      {
        title: 'Cookies and tracking',
        paragraphs: [
          'The website’s code does not use analytics or advertising trackers. Language choices and tool settings are stored in your browser’s local storage. Fonts are served by this website. Some features communicate with the external content services listed on this page.'
        ]
      },
      {
        title: 'Data controller and contact',
        paragraphs: ['Data controller: Daniel Nylander. For privacy questions, contact:'],
        showContactLink: true
      }
    ],
    contact: { prefix: 'Email', email: 'daniel@danielnylander.se', suffix: '' }
  },
  sv: {
    title: 'Integritet och dataskydd',
    intro: 'Så hanteras uppgifter på webbplatsen och i apparna.',
    sections: [
      {
        title: 'Uppgifter som behandlas när du besöker webbplatsen',
        paragraphs: [
          'När en sida hämtas behandlar webbhotellet tekniska uppgifter som IP-adress, webbläsar- och enhetstyp, vilken sida som efterfrågas och tidpunkten. Webbplatsägaren har inaktiverat webbhotellets vanliga åtkomstloggning för de här domänerna. Sidbesök sparas därför inte i webbhotellskontots åtkomstloggar genom den funktionen. Det utesluter inte separat drift- eller säkerhetsloggning hos leverantören eller behandling hos externa tjänster. Webbplatsen har inga konton och frågar inte efter ditt namn.'
        ]
      },
      {
        title: 'Externa innehållstjänster',
        items: [
          {
            name: 'ARASAAC',
            description: 'Vissa verktyg hämtar bildsymboler från ARASAAC. När du söker skickas sökordet och valt språk till ARASAAC:s API. ARASAAC uppger att tredjepartsappars API-användning inte sparas per användare. De sparar bara anonym, sammanställd statistik per app. Nätverksförfrågan innehåller ändå IP-adress och den efterfrågade resursen, så att tjänsten kan svara.',
            link: 'ARASAAC:s integritetspolicy',
            url: 'https://arasaac.org/privacy-policy'
          },
          {
            name: 'Svenskt teckenspråkslexikon',
            description: 'Lexikonet vid Stockholms universitet visar sökresultat, bilder och videor. När du söker skickas sökordet till lexikonets webbplats. För att kunna svara behandlas också tekniska uppgifter, till exempel IP-adress och vilken sida eller fil som efterfrågas. Stockholms universitet har meddelat att inga personuppgifter lagras.',
            link: 'Besök lexikonet',
            url: 'https://teckensprakslexikon.su.se'
          },
          {
            name: 'Hugging Face',
            description: 'Hugging Face tar automatiskt emot användnings- och sessionsuppgifter (datum och plats), IP-adress samt typ och version av enhet, operativsystem och webbläsare. Enligt deras integritetspolicy kan uppgifterna användas för att leverera, driva och förbättra tjänsten, analysera användningen, felsöka och upprätthålla säkerheten. De sparas så länge det behövs för tjänsten, lagkrav, säkerhet och berättigade intressen. Någon fast lagringstid anges inte.',
            detail: 'Text som du skriver för uppläsning skickas inte till Hugging Face.',
            link: 'Hugging Faces integritetspolicy',
            url: 'https://huggingface.co/privacy'
          },
          {
            name: 'jsDelivr',
            description: 'jsDelivr levererar vissa programfiler. Enligt tjänstens personuppgiftsbiträdesavtal behandlas IP-adress, webbläsartyp och version, hänvisande domän, begärd CDN-adress, tidpunkt och diagnostikuppgifter. Avtalet beskriver löpande behandling men anger ingen bestämd lagringstid.',
            link: 'Avtal om databehandling hos jsDelivr',
            url: 'https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net'
          }
        ],
        paragraphs: [
          'När du öppnar en extern länk skickas en vanlig förfrågan till webbplatsen du valt. De tjänsterna ansvarar själva för sin behandling enligt sina villkor och integritetspolicyer.'
        ]
      },
      {
        title: 'Uppgifter som sparas på din enhet',
        bullets: [
          'Språk och inställningar sparas i webbläsarens localStorage.',
          'Scheman, val och en del eget material sparas av respektive verktyg i localStorage eller IndexedDB.',
          'Service worker kan spara appfiler lokalt så att installerade webbappar fungerar offline.'
        ],
        paragraphs: [
          'Innehåll som sparas lokalt med de här funktionerna lämnar inte enheten. Rensa webbplatsens data i webbläsarens inställningar för att ta bort det. Om du avinstallerar en PWA kan webbläsarens lagrade data också försvinna.'
        ]
      },
      {
        title: 'iPad-appen',
        paragraphs: [
          'Appens inbyggda schema och valtavla sparar innehåll på enheten. Appen har ingen inloggning, reklam eller analysverktyg. Flikarna för verktyg, bildstöd och material visar webbplatsen och använder då de externa tjänster som beskrivs här. På iPad används enhetens inbyggda uppläsning. Appen hämtar inga röstmodeller. Internet krävs för webbplatsinnehåll.'
        ]
      },
      {
        title: 'Kakor och spårning',
        paragraphs: [
          'Webbplatsens kod använder inte analys- eller annonsspårning. Språkval och verktygsinställningar sparas i webbläsarens lokala lagring. Typsnitten hämtas från webbplatsen. Vissa funktioner kommunicerar med innehållstjänsterna som nämns här.'
        ]
      },
      {
        title: 'Personuppgiftsansvarig och kontakt',
        paragraphs: ['Personuppgiftsansvarig är Daniel Nylander. Frågor om integritet skickas till:'],
        showContactLink: true
      }
    ],
    contact: { prefix: 'E-post', email: 'daniel@danielnylander.se', suffix: '' }
  },
  pt_BR: {
    title: 'Privacidade e proteção de dados',
    intro: 'Como as informações são tratadas no site e nos aplicativos.',
    sections: [
      {
        title: 'Informações tratadas quando você acessa o site',
        paragraphs: [
          'Quando uma página é solicitada, a hospedagem trata informações técnicas como endereço IP, tipo de navegador e dispositivo, página solicitada e horário. O responsável pelo site desativou o registro de acesso padrão da hospedagem para estes domínios. Por isso, as visitas não são salvas nos registros de acesso da conta por esse recurso. Isso não exclui possíveis registros operacionais ou de segurança separados do provedor, nem o tratamento feito por serviços externos. O site não tem contas e não pede seu nome.'
        ]
      },
      {
        title: 'Serviços externos de conteúdo',
        items: [
          {
            name: 'ARASAAC',
            description: 'Algumas ferramentas usam pictogramas do ARASAAC. Ao pesquisar um pictograma, o termo de busca e o idioma selecionado são enviados à API do ARASAAC. O ARASAAC informa que o uso da API por aplicativos de terceiros não é armazenado por usuário; somente estatísticas anônimas e agregadas por aplicativo são mantidas. A requisição de rede ainda contém seu endereço IP e o recurso solicitado para que o serviço possa responder.',
            link: 'Política de privacidade do ARASAAC',
            url: 'https://arasaac.org/privacy-policy'
          },
          {
            name: 'Dicionário Sueco de Língua de Sinais',
            description: 'O dicionário da Universidade de Estocolmo fornece resultados de busca, imagens e vídeos. Ao pesquisar, o termo é enviado ao site do dicionário. Também são tratadas informações técnicas necessárias para responder, como endereço IP e a página ou arquivo solicitado. A Universidade de Estocolmo nos informou que não armazena dados pessoais.',
            link: 'Visitar o dicionário',
            url: 'https://teckensprakslexikon.su.se'
          },
          {
            name: 'Hugging Face',
            description: 'O Hugging Face recebe automaticamente informações de uso e sessão (data e local), endereço IP, tipo e versão do dispositivo, sistema operacional e navegador. A política de privacidade informa que esses dados podem ser usados para fornecer, operar e melhorar o serviço, analisar o uso, solucionar problemas e manter a segurança. Eles são mantidos pelo tempo necessário para o serviço, obrigações legais, segurança e interesses legítimos; não há um prazo fixo informado.',
            detail: 'O texto digitado para ser lido em voz alta não é enviado ao Hugging Face.',
            link: 'Política de privacidade do Hugging Face',
            url: 'https://huggingface.co/privacy'
          },
          {
            name: 'jsDelivr',
            description: 'O jsDelivr entrega alguns arquivos de programa. Seu acordo de tratamento de dados lista endereço IP, tipo e versão do navegador, domínio de origem, endereço CDN solicitado, horário e informações de diagnóstico. O acordo descreve o tratamento contínuo, mas não especifica um prazo fixo de retenção.',
            link: 'Acordo de tratamento de dados do jsDelivr',
            url: 'https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net'
          }
        ],
        paragraphs: [
          'Ao abrir um link externo, uma solicitação comum é enviada ao site escolhido. Esses serviços são responsáveis pelo tratamento de acordo com seus próprios termos e políticas de privacidade.'
        ]
      },
      {
        title: 'Informações armazenadas no seu dispositivo',
        bullets: [
          'O idioma e as configurações ficam no localStorage do navegador.',
          'Rotinas, escolhas e alguns materiais criados por você ficam no localStorage ou no IndexedDB de cada ferramenta.',
          'O service worker pode armazenar arquivos do app em cache para que os aplicativos web instalados funcionem offline.'
        ],
        paragraphs: [
          'O conteúdo armazenado localmente por esses recursos não sai do seu dispositivo. Apague os dados do site nas configurações do navegador para removê-lo. Desinstalar um PWA também pode apagar os dados armazenados pelo navegador.'
        ]
      },
      {
        title: 'O app para iPad',
        paragraphs: [
          'A rotina e o quadro de escolhas integrados ao app armazenam o conteúdo no dispositivo. O app não tem login, publicidade ou ferramentas de análise. As abas de ferramentas, pictogramas e materiais exibem o site e usam os serviços externos descritos acima. No iPad, o app usa a síntese de voz integrada ao dispositivo e não baixa modelos de voz. É necessário ter internet para acessar o conteúdo do site.'
        ]
      },
      {
        title: 'Cookies e rastreamento',
        paragraphs: [
          'O código do site não usa ferramentas de análise nem rastreadores de publicidade. O idioma e as configurações das ferramentas ficam no armazenamento local do navegador. As fontes são fornecidas pelo próprio site. Alguns recursos se comunicam com os serviços externos de conteúdo listados nesta página.'
        ]
      },
      {
        title: 'Controlador de dados e contato',
        paragraphs: ['Controlador de dados: Daniel Nylander. Para dúvidas sobre privacidade, escreva para:'],
        showContactLink: true
      }
    ],
    contact: { prefix: 'E-mail', email: 'daniel@danielnylander.se', suffix: '' }
  }
};
