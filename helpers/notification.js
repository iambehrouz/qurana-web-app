import helpers from "./index";

export default class notification {
  static types = {
    note: 0,
    info: 1,
    success: 2,
    error: 3,
  };
  static configs = {
    notificationTimeout: 2,
  };

  static getTopZIndex() {
    var result = 0;
    $("div:not(.helpers-loader-container)")
      .not(".helpers-loader-container *")
      .each(function (index, object) {
        if (
          parseInt($(object).css("z-index").replace("auto", "0")) > 0 ||
          $(object).css("display") != "none"
        ) {
          if (
            parseInt($(object).css("z-index").replace("auto", "0")) > result
          ) {
            result = parseInt($(object).css("z-index").replace("auto", "0"));
          }
        }
      });

    return result;
  }
  static dispose(notificationId) {
    $(".helpers-notification-item-" + notificationId).remove();
  }

  static show(provider, type, message, timeout) {
    var iRandom = parseInt(Math.random() * 1000000);

    if ($(".helpers-notification-container").length == 0)
      $("body").append(
        $(document.createElement("div"))
          .addClass("helpers-notification-container")
          .css({
            display: "block",
            height: 0,
            position: "fixed",
            top: "50px",
            left: "50%",
            transform: "translate(-50%, -50%)",
            direction: "rtl",
            "text-align": "center",
            background: "transparent",
            "z-index": helpers.notification.getTopZIndex() + 1,
          })
      );

    var background = "";
    let notificationType = "";

    if (type == helpers.notification.types.note) {
      notificationType = "alert-dark";
    } else if (type == helpers.notification.types.info) {
      notificationType = "alert-warning";
    } else if (type == helpers.notification.types.success) {
      background = "#d5ffd5";
      notificationType = "alert-success";
    } else if (type == helpers.notification.types.error) {
      notificationType = "alert-danger";
    }

    $("." + provider).remove();

    $(".helpers-notification-container").append(
      $(document.createElement("div"))
        .addClass("helpers-notification-item")

        .addClass("helpers-notification-item-" + iRandom)
        .addClass(provider)
        .css("margin-bottom", "10px")
    );
    $(".helpers-notification-item-" + iRandom).append(
      $(document.createElement("div"))
        .addClass("helpers-notification-body alert")
        .addClass(notificationType)
        .text(message)
        .css({
          display: "inline-block",
          padding: "5px 10px",
          margin: "0",
          background: background,
          opacity: "0",
          transition: "all 0.2s linear",
        })
    );
    $(
      ".helpers-notification-item-" + iRandom + " .helpers-notification-body"
    ).append(
      $(document.createElement("span"))
        .addClass("fas fa-times")
        .css({
          "padding-right": "10px",
          "line-height": "28px",
          cursor: "pointer",
        })
        .click(function () {
          helpers.notification.dispose(iRandom);
        })
    );
    setTimeout(function () {
      $(
        ".helpers-notification-item-" + iRandom + " .helpers-notification-body"
      ).css({ opacity: 1 });
    }, 100);
    if (timeout) {
      setTimeout(function () {
        helpers.notification.dispose(iRandom);
      }, timeout * 1000);
    }
  }
}
