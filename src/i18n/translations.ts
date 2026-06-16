export type Lang = "es" | "en" | "pt";

export interface Translations {
  tabs: {
    welcome: string;
    license: string;
    options: string;
    installing: string;
    finish: string;
  };

  sidebar: {
    officialInstaller: string;
    system: string;
    os: string;
    arch: string;
    java: string;
    space: string;
    support: string;
  };

  splash: {
    tagline: string;
  };

  welcome: {
    title: string;
    subtitle: string;
    install: { title: string; desc: string };
    repair:  { title: string; desc: string };
    uninstall: { title: string; desc: string };
    disclaimer: string;
    next: string;
  };

  license: {
    title: string;
    subtitle: string;
    accept: string;
    acceptBtn: string;
    back: string;
    licenseText: string;
  };

  installDir: {
    title: string;
    titleRepair: string;
    titleUninstall: string;
    subtitle: string;
    subtitleRepair: string;
    subtitleUninstall: string;
    folderLabel: string;
    folderLabelFind: string;
    placeholder: string;
    placeholderFind: string;
    browse: string;
    calculating: string;
    optionsLabel: string;
    desktopShortcut: string;
    startMenu: string;
    launchAfter: string;
    requiredSpace: string;
    sufficientSpace: string;
    back: string;
    install: string;
    repair: string;
    uninstall: string;
    dialogTitle: string;
    dialogTitleFind: string;
    warningUninstall: string;
    warningRepair: string;
  };

  installing: {
    titleDone: string;
    titleBusy: string;
    titleBusyRepair: string;
    titleBusyUninstall: string;
    subtitleDone: string;
    subtitleBusy: string;
    cardDone: string;
    cardBusy: string;
    cardBusyRepair: string;
    cardBusyUninstall: string;
    logLabel: string;
    logWaiting: string;
    noClose: string;
    taskDone: string;
  };

  finish: {
    title: string;
    subtitle: string;
    subtitleRepair: string;
    subtitleUninstall: string;
    heading: string;
    headingRepair: string;
    headingUninstall: string;
    desc: string;
    descRepair: string;
    descUninstall: string;
    descLaunch: string;
    close: string;
    launch: string;
  };

  error: {
    title: string;
    subtitle: string;
    help: string;
    discord: string;
    close: string;
    retry: string;
  };

  titlebar: {
    title: string;
  };
}

const es: Translations = {
  tabs: {
    welcome:    "Bienvenida",
    license:    "Licencia",
    options:    "Opciones",
    installing: "Instalando",
    finish:     "Finalizar",
  },
  sidebar: {
    officialInstaller: "Installer oficial",
    system:  "Sistema",
    os:      "OS",
    arch:    "Arch",
    java:    "Java",
    space:   "Espacio",
    support: "Soporte · Discord",
  },
  splash: {
    tagline: "Installer",
  },
  welcome: {
    title:    "Bienvenido al instalador",
    subtitle: "Este asistente te guiará para instalar, reparar o desinstalar la aplicación.",
    install:   { title: "Instalar",    desc: "Instala o actualiza Modstack." },
    repair:    { title: "Reparar",     desc: "Repara y re-registra componentes." },
    uninstall: { title: "Desinstalar", desc: "Elimina Modstack por completo." },
    disclaimer: "Modstack no está afiliado a Mojang Studios ni a Microsoft",
    next: "Siguiente →",
  },
  license: {
    title:      "Acuerdo de licencia",
    subtitle:   "Lee y acepta los términos antes de continuar.",
    accept:     "He leído y acepto el Acuerdo de Licencia de Modstack",
    acceptBtn:  "Aceptar y continuar",
    back:       "← Atrás",
    licenseText: `MODSTACK LAUNCHER — ACUERDO DE LICENCIA DE USUARIO FINAL

Última actualización: 2025

Al instalar Modstack Launcher ("el Software"), aceptas estos términos.

1. CONCESIÓN DE LICENCIA
   Modstack te otorga una licencia no exclusiva, intransferible y revocable
   para instalar y usar el Software únicamente con fines personales y no
   comerciales.

2. RESTRICCIONES
   No puedes: (a) sublicenciar, vender o distribuir el Software; (b)
   realizar ingeniería inversa o descompilar el Software; (c) usar el
   Software para fines ilícitos.

3. MINECRAFT
   Modstack Launcher es una herramienta no oficial de terceros. No está
   afiliada, respaldada ni asociada con Mojang Studios o Microsoft
   Corporation. Minecraft® es una marca registrada de Mojang Studios.

4. EXENCIÓN DE GARANTÍAS
   EL SOFTWARE SE PROPORCIONA "TAL CUAL" SIN GARANTÍA DE NINGÚN TIPO.
   MODSTACK RECHAZA TODA GARANTÍA, EXPRESA O IMPLÍCITA.

5. LIMITACIÓN DE RESPONSABILIDAD
   EN NINGÚN CASO MODSTACK SERÁ RESPONSABLE POR DAÑOS INDIRECTOS,
   INCIDENTALES, ESPECIALES O CONSECUENTES DERIVADOS DEL USO DEL SOFTWARE.

6. ACTUALIZACIONES
   El Software puede descargar e instalar actualizaciones automáticamente.
   Al usar el Software, aceptas dichas actualizaciones.

7. TERMINACIÓN
   Esta licencia es efectiva hasta su terminación. Se terminará
   automáticamente si incumples cualquier término de este acuerdo.

Para preguntas, contacta: support@modstack.app`,
  },
  installDir: {
    title:            "Opciones de instalación",
    titleRepair:      "Reparar Modstack",
    titleUninstall:   "Desinstalar Modstack",
    subtitle:         "Elige dónde instalar Modstack Launcher.",
    subtitleRepair:   "No encontramos Modstack en el registro. Selecciona la carpeta manualmente.",
    subtitleUninstall:"No encontramos Modstack en el registro. Selecciona la carpeta manualmente.",
    folderLabel:      "Carpeta de instalación",
    folderLabelFind:  "Carpeta de Modstack",
    placeholder:      "Selecciona una carpeta...",
    placeholderFind:  "Busca la carpeta donde está Modstack...",
    browse:           "Buscar",
    calculating:      "Calculando...",
    optionsLabel:     "Opciones",
    desktopShortcut:  "Crear acceso directo en el escritorio",
    startMenu:        "Agregar al menú de inicio",
    launchAfter:      "Iniciar Modstack después de instalar",
    requiredSpace:    "Espacio requerido:",
    sufficientSpace:  "✓ Espacio en disco suficiente",
    back:             "← Atrás",
    install:          "Instalar →",
    repair:           "Reparar →",
    uninstall:        "Desinstalar →",
    dialogTitle:      "Elige la carpeta de instalación",
    dialogTitleFind:  "Selecciona la carpeta donde está Modstack",
    warningUninstall: "Se eliminarán todos los archivos de Modstack de esta carpeta.",
    warningRepair:    "Se reemplazarán los archivos de Modstack en esta carpeta.",
  },
  installing: {
    titleDone:    "¡Listo!",
    titleBusy:    "Instalando",
    titleBusyRepair:    "Reparando",
    titleBusyUninstall: "Desinstalando",
    subtitleDone: "Modstack se instaló correctamente.",
    subtitleBusy: "Esto tardará menos de un minuto.",
    cardDone:     "Instalación completa",
    cardBusy:     "Instalando Modstack...",
    cardBusyRepair:    "Reparando Modstack...",
    cardBusyUninstall: "Desinstalando Modstack...",
    logLabel:     "Registro de instalación",
    logWaiting:   "Esperando eventos...",
    noClose:      "No cierres esta ventana, por favor.",
    taskDone:     "¡Instalación completa!",
  },
  finish: {
    title:            "Finalizar",
    subtitle:         "La instalación se completó correctamente.",
    subtitleRepair:   "La reparación se completó correctamente.",
    subtitleUninstall:"Modstack fue desinstalado correctamente.",
    heading:          "¡Instalación completa!",
    headingRepair:    "¡Reparación completa!",
    headingUninstall: "¡Desinstalación completa!",
    desc:             "Modstack Launcher se instaló correctamente.",
    descRepair:       "Modstack Launcher fue reparado correctamente.",
    descUninstall:    "Modstack Launcher fue eliminado del sistema.",
    descLaunch:  " ¡Listo para iniciar!",
    close:       "Cerrar",
    launch:      "Iniciar Modstack →",
  },
  error: {
    title:    "Falló la instalación",
    subtitle: "Algo salió mal durante la instalación. Puedes reintentar o reportar el problema.",
    help:     "¿Necesitas ayuda? Únete a nuestro",
    discord:  "servidor de Discord",
    close:    "Cerrar",
    retry:    "Reintentar",
  },
  titlebar: {
    title: "Modstack Installer",
  },
};

const en: Translations = {
  tabs: {
    welcome:    "Welcome",
    license:    "License",
    options:    "Options",
    installing: "Installing",
    finish:     "Finish",
  },
  sidebar: {
    officialInstaller: "Official installer",
    system:  "System",
    os:      "OS",
    arch:    "Arch",
    java:    "Java",
    space:   "Space",
    support: "Support · Discord",
  },
  splash: {
    tagline: "Installer",
  },
  welcome: {
    title:    "Welcome to the installer",
    subtitle: "This wizard will guide you to install, repair or uninstall the application.",
    install:   { title: "Install",   desc: "Install or update Modstack." },
    repair:    { title: "Repair",    desc: "Repair and re-register components." },
    uninstall: { title: "Uninstall", desc: "Completely remove Modstack." },
    disclaimer: "Modstack is not affiliated with Mojang Studios or Microsoft",
    next: "Next →",
  },
  license: {
    title:     "License Agreement",
    subtitle:  "Please read and accept the terms before continuing.",
    accept:    "I have read and agree to the Modstack License Agreement",
    acceptBtn: "Accept & Continue",
    back:      "← Back",
    licenseText: `MODSTACK LAUNCHER — END USER LICENSE AGREEMENT

Last updated: 2025

By installing Modstack Launcher ("the Software"), you agree to these terms.

1. LICENSE GRANT
   Modstack grants you a non-exclusive, non-transferable, revocable license to
   install and use the Software solely for your personal, non-commercial purposes.

2. RESTRICTIONS
   You may not: (a) sublicense, sell, or distribute the Software; (b) reverse
   engineer or decompile the Software; (c) use the Software for any unlawful
   purpose.

3. MINECRAFT
   Modstack Launcher is an unofficial third-party tool. It is not affiliated
   with, endorsed by, or associated with Mojang Studios or Microsoft Corporation.
   Minecraft® is a registered trademark of Mojang Studios.

4. DISCLAIMER OF WARRANTIES
   THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. MODSTACK
   DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED.

5. LIMITATION OF LIABILITY
   IN NO EVENT SHALL MODSTACK BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
   OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OF THE SOFTWARE.

6. UPDATES
   The Software may automatically download and install updates. By using the
   Software, you consent to such updates.

7. TERMINATION
   This license is effective until terminated. It will terminate automatically
   if you fail to comply with any term of this agreement.

For questions, contact: support@modstack.app`,
  },
  installDir: {
    title:            "Installation Options",
    titleRepair:      "Repair Modstack",
    titleUninstall:   "Uninstall Modstack",
    subtitle:         "Choose where to install Modstack Launcher.",
    subtitleRepair:   "Modstack was not found in the registry. Please select the folder manually.",
    subtitleUninstall:"Modstack was not found in the registry. Please select the folder manually.",
    folderLabel:      "Installation folder",
    folderLabelFind:  "Modstack folder",
    placeholder:      "Select a folder...",
    placeholderFind:  "Find the folder where Modstack is installed...",
    browse:           "Browse",
    calculating:      "Calculating...",
    optionsLabel:     "Options",
    desktopShortcut:  "Create desktop shortcut",
    startMenu:        "Add to Start Menu",
    launchAfter:      "Launch Modstack after install",
    requiredSpace:    "Required space:",
    sufficientSpace:  "✓ Sufficient disk space available",
    back:             "← Back",
    install:          "Install →",
    repair:           "Repair →",
    uninstall:        "Uninstall →",
    dialogTitle:      "Choose installation folder",
    dialogTitleFind:  "Select the folder where Modstack is installed",
    warningUninstall: "All Modstack files in this folder will be permanently deleted.",
    warningRepair:    "Modstack files in this folder will be replaced.",
  },
  installing: {
    titleDone:    "Done!",
    titleBusy:    "Installing",
    titleBusyRepair:    "Repairing",
    titleBusyUninstall: "Uninstalling",
    subtitleDone: "Modstack was installed successfully.",
    subtitleBusy: "This will take less than a minute.",
    cardDone:     "Installation complete",
    cardBusy:     "Installing Modstack...",
    cardBusyRepair:    "Repairing Modstack...",
    cardBusyUninstall: "Uninstalling Modstack...",
    logLabel:     "Installation log",
    logWaiting:   "Waiting for events...",
    noClose:      "Please do not close this window.",
    taskDone:     "Installation complete!",
  },
  finish: {
    title:            "Finish",
    subtitle:         "Installation completed successfully.",
    subtitleRepair:   "Repair completed successfully.",
    subtitleUninstall:"Modstack was uninstalled successfully.",
    heading:          "Installation complete!",
    headingRepair:    "Repair complete!",
    headingUninstall: "Uninstall complete!",
    desc:             "Modstack Launcher was installed successfully.",
    descRepair:       "Modstack Launcher was repaired successfully.",
    descUninstall:    "Modstack Launcher was removed from your system.",
    descLaunch: " Ready to launch!",
    close:      "Close",
    launch:     "Launch Modstack →",
  },
  error: {
    title:    "Installation Failed",
    subtitle: "Something went wrong during installation. You can retry or report the issue.",
    help:     "Need help? Join our",
    discord:  "Discord server",
    close:    "Close",
    retry:    "Retry",
  },
  titlebar: {
    title: "Modstack Installer",
  },
};

const pt: Translations = {
  tabs: {
    welcome:    "Bem-vindo",
    license:    "Licença",
    options:    "Opções",
    installing: "Instalando",
    finish:     "Finalizar",
  },
  sidebar: {
    officialInstaller: "Instalador oficial",
    system:  "Sistema",
    os:      "OS",
    arch:    "Arch",
    java:    "Java",
    space:   "Espaço",
    support: "Suporte · Discord",
  },
  splash: {
    tagline: "Instalador",
  },
  welcome: {
    title:    "Bem-vindo ao instalador",
    subtitle: "Este assistente irá guiá-lo para instalar, reparar ou desinstalar o aplicativo.",
    install:   { title: "Instalar",     desc: "Instala ou atualiza o Modstack." },
    repair:    { title: "Reparar",      desc: "Repara e re-registra componentes." },
    uninstall: { title: "Desinstalar",  desc: "Remove o Modstack completamente." },
    disclaimer: "O Modstack não é afiliado à Mojang Studios nem à Microsoft",
    next: "Próximo →",
  },
  license: {
    title:     "Contrato de licença",
    subtitle:  "Leia e aceite os termos antes de continuar.",
    accept:    "Li e aceito o Contrato de Licença do Modstack",
    acceptBtn: "Aceitar e continuar",
    back:      "← Voltar",
    licenseText: `MODSTACK LAUNCHER — CONTRATO DE LICENÇA DE USUÁRIO FINAL

Última atualização: 2025

Ao instalar o Modstack Launcher ("o Software"), você concorda com estes termos.

1. CONCESSÃO DE LICENÇA
   A Modstack concede a você uma licença não exclusiva, intransferível e revogável
   para instalar e usar o Software exclusivamente para fins pessoais e não
   comerciais.

2. RESTRIÇÕES
   Você não pode: (a) sublicenciar, vender ou distribuir o Software; (b)
   fazer engenharia reversa ou descompilar o Software; (c) usar o Software
   para fins ilegais.

3. MINECRAFT
   O Modstack Launcher é uma ferramenta não oficial de terceiros. Não está
   afiliado, endossado nem associado à Mojang Studios ou Microsoft Corporation.
   Minecraft® é uma marca registrada da Mojang Studios.

4. ISENÇÃO DE GARANTIAS
   O SOFTWARE É FORNECIDO "NO ESTADO EM QUE SE ENCONTRA" SEM GARANTIA DE
   QUALQUER TIPO. A MODSTACK ISENTA-SE DE TODAS AS GARANTIAS, EXPRESSAS OU
   IMPLÍCITAS.

5. LIMITAÇÃO DE RESPONSABILIDADE
   EM NENHUM CASO A MODSTACK SERÁ RESPONSÁVEL POR DANOS INDIRETOS, INCIDENTAIS,
   ESPECIAIS OU CONSEQUENTES DECORRENTES DO USO DO SOFTWARE.

6. ATUALIZAÇÕES
   O Software pode baixar e instalar atualizações automaticamente. Ao usar o
   Software, você consente com essas atualizações.

7. RESCISÃO
   Esta licença é efetiva até ser rescindida. Será rescindida automaticamente
   se você descumprir qualquer termo deste contrato.

Para dúvidas, contate: support@modstack.app`,
  },
  installDir: {
    title:            "Opções de instalação",
    titleRepair:      "Reparar Modstack",
    titleUninstall:   "Desinstalar Modstack",
    subtitle:         "Escolha onde instalar o Modstack Launcher.",
    subtitleRepair:   "O Modstack não foi encontrado no registro. Selecione a pasta manualmente.",
    subtitleUninstall:"O Modstack não foi encontrado no registro. Selecione a pasta manualmente.",
    folderLabel:      "Pasta de instalação",
    folderLabelFind:  "Pasta do Modstack",
    placeholder:      "Selecione uma pasta...",
    placeholderFind:  "Encontre a pasta onde o Modstack está instalado...",
    browse:           "Procurar",
    calculating:      "Calculando...",
    optionsLabel:     "Opções",
    desktopShortcut:  "Criar atalho na área de trabalho",
    startMenu:        "Adicionar ao menu Iniciar",
    launchAfter:      "Iniciar o Modstack após a instalação",
    requiredSpace:    "Espaço necessário:",
    sufficientSpace:  "✓ Espaço em disco suficiente",
    back:             "← Voltar",
    install:          "Instalar →",
    repair:           "Reparar →",
    uninstall:        "Desinstalar →",
    dialogTitle:      "Escolha a pasta de instalação",
    dialogTitleFind:  "Selecione a pasta onde o Modstack está instalado",
    warningUninstall: "Todos os arquivos do Modstack nesta pasta serão excluídos permanentemente.",
    warningRepair:    "Os arquivos do Modstack nesta pasta serão substituídos.",
  },
  installing: {
    titleDone:    "Pronto!",
    titleBusy:    "Instalando",
    titleBusyRepair:    "Reparando",
    titleBusyUninstall: "Desinstalando",
    subtitleDone: "O Modstack foi instalado com sucesso.",
    subtitleBusy: "Isso levará menos de um minuto.",
    cardDone:     "Instalação concluída",
    cardBusy:     "Instalando Modstack...",
    cardBusyRepair:    "Reparando Modstack...",
    cardBusyUninstall: "Desinstalando Modstack...",
    logLabel:     "Registro de instalação",
    logWaiting:   "Aguardando eventos...",
    noClose:      "Por favor, não feche esta janela.",
    taskDone:     "Instalação concluída!",
  },
  finish: {
    title:            "Finalizar",
    subtitle:         "A instalação foi concluída com sucesso.",
    subtitleRepair:   "A reparação foi concluída com sucesso.",
    subtitleUninstall:"O Modstack foi desinstalado com sucesso.",
    heading:          "Instalação concluída!",
    headingRepair:    "Reparação concluída!",
    headingUninstall: "Desinstalação concluída!",
    desc:             "O Modstack Launcher foi instalado com sucesso.",
    descRepair:       "O Modstack Launcher foi reparado com sucesso.",
    descUninstall:    "O Modstack Launcher foi removido do sistema.",
    descLaunch: " Pronto para iniciar!",
    close:      "Fechar",
    launch:     "Iniciar Modstack →",
  },
  error: {
    title:    "Falha na instalação",
    subtitle: "Algo deu errado durante a instalação. Você pode tentar novamente ou reportar o problema.",
    help:     "Precisa de ajuda? Entre no nosso",
    discord:  "servidor do Discord",
    close:    "Fechar",
    retry:    "Tentar novamente",
  },
  titlebar: {
    title: "Modstack Installer",
  },
};

export const translations: Record<Lang, Translations> = { es, en, pt };