export default function(app) {
    if(app.config.keyboardShortcutEnable !== true) return;
 
    this.listenKeyBoard([
        // 13 = touche entrée, openModifQuestion = ouverture popup avec formulaire pour modification
        {keyCode: 37, cb : () => {

            if(app.context == 'global') { 
                let link;
                
                if($(`.nav-item.active`).prev('.nav-item').length > 0)
                    link = $(`.nav-item.active`).prev('.nav-item').find('a').attr('href')
                else {
                    link = $('.navbar-nav .nav-item:last').find('a').attr('href')
                }
                app.mvc.router.navigateTo(link)
            }
        }},
        {keyCode: 39, cb : () => {
            if(app.context == 'global') { 
                let link;
                if($(`.nav-item.active`).next('.nav-item').length > 0)
                    link = $(`.nav-item.active`).next('.nav-item').find('a').attr('href')
                else
                    link = $('.navbar-nav .nav-item:first').find('a').attr('href')
                app.mvc.router.navigateTo(link)
            }
        }},
        {keyCode: 32, cb : () => {
            if(app.config.voiceEnable) {
                if(app.voice.started) app.voice.stop()
                else app.voice.start()
            }
        }},
    ])

}