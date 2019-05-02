
class ApiResultBase {
    constructor(){
        this.isSuccess = false;
    }
    setIsSuccess(isSuccess) {
        this.isSuccess = isSuccess;
    }

    setData(data) {
        this.data = data;
    }  
}

module.exports.ApiResultBase = ApiResultBase;
