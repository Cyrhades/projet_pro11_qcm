export default function(app) {

    document.addEventListener('keyup', (e) => {
        if(e.keyCode == 32 && app.config.voiceEnable) {
            if(app.voice.started) app.voice.stop()
            else app.voice.start()
        }
    })
}