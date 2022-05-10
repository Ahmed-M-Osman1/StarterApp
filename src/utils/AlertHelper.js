export class AlertHelper {
  static dropDown;
  static onClose;

  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }

  static show(type, title, error) {
    if (this.dropDown) {
      error?.response?.status === 400
        ? this.dropDown.alertWithType(type, title, 'Error 400')
        : error?.response?.status === 500
        ? this.dropDown.alertWithType(type, title, 'Error 500')
        : this.dropDown.alertWithType(
            type,
            title,
            Object.values(error.response?.data?.errors)[0][0],
          );
    }
  }
  static showMessage(type, title, message) {
    if (this.dropDown) {
      this.dropDown.alertWithType(type, title, message);
    }
  }
  //
  static setOnClose(onClose) {
    this.onClose = onClose;
  }
  //
  static invokeOnClose() {
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }
}
