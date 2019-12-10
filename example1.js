Module = {
    onRuntimeInitialized(){
        console.log(cv.getBuildInformation())
    }
}
cv = require('./opencv.js')