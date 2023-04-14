let mailer = require("./nodemailer");
let business = require("../database/details");

async function orderVendorEmail(order, product, user) {
  const template = `
    <!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title></title>
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]-->
  <meta name="viewport" content="width=device-width" />
  <style type="text/css">
    @media only screen and (min-width: 620px) {
      .wrapper {
        min-width: 600px !important
      }

      .wrapper h1 {}

      .wrapper h1 {
        font-size: 26px !important;
        line-height: 34px !important
      }

      .wrapper h2 {}

      .wrapper h2 {
        font-size: 20px !important;
        line-height: 28px !important
      }

      .wrapper h3 {}

      .column {}

      .wrapper .size-8 {
        font-size: 8px !important;
        line-height: 14px !important
      }

      .wrapper .size-9 {
        font-size: 9px !important;
        line-height: 16px !important
      }

      .wrapper .size-10 {
        font-size: 10px !important;
        line-height: 18px !important
      }

      .wrapper .size-11 {
        font-size: 11px !important;
        line-height: 19px !important
      }

      .wrapper .size-12 {
        font-size: 12px !important;
        line-height: 19px !important
      }

      .wrapper .size-13 {
        font-size: 13px !important;
        line-height: 21px !important
      }

      .wrapper .size-14 {
        font-size: 14px !important;
        line-height: 21px !important
      }

      .wrapper .size-15 {
        font-size: 15px !important;
        line-height: 23px !important
      }

      .wrapper .size-16 {
        font-size: 16px !important;
        line-height: 24px !important
      }

      .wrapper .size-17 {
        font-size: 17px !important;
        line-height: 26px !important
      }

      .wrapper .size-18 {
        font-size: 18px !important;
        line-height: 26px !important
      }

      .wrapper .size-20 {
        font-size: 20px !important;
        line-height: 28px !important
      }

      .wrapper .size-22 {
        font-size: 22px !important;
        line-height: 31px !important
      }

      .wrapper .size-24 {
        font-size: 24px !important;
        line-height: 32px !important
      }

      .wrapper .size-26 {
        font-size: 26px !important;
        line-height: 34px !important
      }

      .wrapper .size-28 {
        font-size: 28px !important;
        line-height: 36px !important
      }

      .wrapper .size-30 {
        font-size: 30px !important;
        line-height: 38px !important
      }

      .wrapper .size-32 {
        font-size: 32px !important;
        line-height: 40px !important
      }

      .wrapper .size-34 {
        font-size: 34px !important;
        line-height: 43px !important
      }

      .wrapper .size-36 {
        font-size: 36px !important;
        line-height: 43px !important
      }

      .wrapper .size-40 {
        font-size: 40px !important;
        line-height: 47px !important
      }

      .wrapper .size-44 {
        font-size: 44px !important;
        line-height: 50px !important
      }

      .wrapper .size-48 {
        font-size: 48px !important;
        line-height: 54px !important
      }

      .wrapper .size-56 {
        font-size: 56px !important;
        line-height: 60px !important
      }

      .wrapper .size-64 {
        font-size: 64px !important;
        line-height: 68px !important
      }

      .wrapper .size-72 {
        font-size: 72px !important;
        line-height: 76px !important
      }

      .wrapper .size-80 {
        font-size: 80px !important;
        line-height: 84px !important
      }

      .wrapper .size-96 {
        font-size: 96px !important;
        line-height: 100px !important
      }

      .wrapper .size-112 {
        font-size: 112px !important;
        line-height: 116px !important
      }

      .wrapper .size-128 {
        font-size: 128px !important;
        line-height: 132px !important
      }

      .wrapper .size-144 {
        font-size: 144px !important;
        line-height: 148px !important
      }
    }
  </style>
  <meta name="x-apple-disable-message-reformatting" />
  <style type="text/css">
    .main,
    .mso {
      margin: 0;
      padding: 0;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
    }

    * {
      line-height: inherit;
    }

    [x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
    }

    .wrapper .footer__share-button a:hover,
    .wrapper .footer__share-button a:focus {
      color: #ffffff !important;
    }

    .wrapper .footer__share-button a.icon-white:hover,
    .wrapper .footer__share-button a.icon-white:focus {
      color: #ffffff !important;
    }

    .wrapper .footer__share-button a.icon-black:hover,
    .wrapper .footer__share-button a.icon-black:focus {
      color: #000000 !important;
    }

    .btn a:hover,
    .btn a:focus,
    .footer__share-button a:hover,
    .footer__share-button a:focus,
    .email-footer__links a:hover,
    .email-footer__links a:focus {
      opacity: 0.8;
    }

    .preheader,
    .header,
    .layout,
    .column {
      transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
    }

    .preheader td {
      padding-bottom: 8px;
    }

    .layout,
    div.header {
      max-width: 400px !important;
      -fallback-width: 95% !important;
      width: calc(100% - 20px) !important;
    }

    div.preheader {
      max-width: 360px !important;
      -fallback-width: 90% !important;
      width: calc(100% - 60px) !important;
    }

    .snippet,
    .webversion {
      Float: none !important;
    }

    .stack .column {
      max-width: 400px !important;
      width: 100% !important;
    }

    .fixed-width.has-border {
      max-width: 402px !important;
    }

    .fixed-width.has-border .layout__inner {
      box-sizing: border-box;
    }

    .snippet,
    .webversion {
      width: 50% !important;
    }

    .mso .layout__edges {
      font-size: 0;
    }

    .layout-fixed-width,
    .mso .layout-full-width {
      background-color: #ffffff;
    }

    @media only screen and (min-width: 620px) {

      .column,
      .gutter {
        display: table-cell;
        Float: none !important;
        vertical-align: top;
      }

      div.preheader,
      .email-footer {
        max-width: 560px !important;
        width: 560px !important;
      }

      .snippet,
      .webversion {
        width: 280px !important;
      }

      div.header,
      .layout,
      .one-col .column {
        max-width: 600px !important;
        width: 600px !important;
      }

      .fixed-width.has-border,
      .fixed-width.x_has-border,
      .has-gutter.has-border,
      .has-gutter.x_has-border {
        max-width: 602px !important;
        width: 602px !important;
      }

      .two-col .column {
        max-width: 300px !important;
        width: 300px !important;
      }

      .three-col .column,
      .column.narrow,
      .column.x_narrow {
        max-width: 200px !important;
        width: 200px !important;
      }

      .column.wide,
      .column.x_wide {
        width: 400px !important;
      }

      .two-col.has-gutter .column,
      .two-col.x_has-gutter .column {
        max-width: 290px !important;
        width: 290px !important;
      }

      .three-col.has-gutter .column,
      .three-col.x_has-gutter .column,
      .has-gutter .narrow {
        max-width: 188px !important;
        width: 188px !important;
      }

      .has-gutter .wide {
        max-width: 394px !important;
        width: 394px !important;
      }

      .two-col.has-gutter.has-border .column,
      .two-col.x_has-gutter.x_has-border .column {
        max-width: 292px !important;
        width: 292px !important;
      }

      .three-col.has-gutter.has-border .column,
      .three-col.x_has-gutter.x_has-border .column,
      .has-gutter.has-border .narrow,
      .has-gutter.x_has-border .narrow {
        max-width: 190px !important;
        width: 190px !important;
      }

      .has-gutter.has-border .wide,
      .has-gutter.x_has-border .wide {
        max-width: 396px !important;
        width: 396px !important;
      }
    }

    @supports (display: flex) {
      @media only screen and (min-width: 620px) {
        .fixed-width.has-border .layout__inner {
          display: flex !important;
        }
      }
    }

    /***
* Mobile Styles
*
* 1. Overriding inline styles
*/
    @media(max-width: 619px) {

      .email-flexible-footer .left-aligned-footer .column,
      .email-flexible-footer .center-aligned-footer,
      .email-flexible-footer .right-aligned-footer .column {
        max-width: 100% !important;
        /* [1] */
        text-align: center !important;
        /* [1] */
        width: 100% !important;
        /* [1] */
      }

      .flexible-footer-logo {
        margin-left: 0px !important;
        /* [1] */
        margin-right: 0px !important;
        /* [1] */
      }

      .email-flexible-footer .left-aligned-footer .flexible-footer__share-button__container,
      .email-flexible-footer .center-aligned-footer .flexible-footer__share-button__container,
      .email-flexible-footer .right-aligned-footer .flexible-footer__share-button__container {
        display: inline-block;
        margin-left: 5px !important;
        /* [1] */
        margin-right: 5px !important;
        /* [1] */
      }

      .email-flexible-footer__additionalinfo--center {
        text-align: center !important;
        /* [1] */
      }

      .email-flexible-footer .left-aligned-footer table,
      .email-flexible-footer .center-aligned-footer table,
      .email-flexible-footer .right-aligned-footer table {
        display: table !important;
        /* [1] */
        width: 100% !important;
        /* [1] */
      }

      .email-flexible-footer .footer__share-button,
      .email-flexible-footer .email-footer__additional-info {
        margin-left: 20px;
        margin-right: 20px;
      }
    }

    @media only screen and (-webkit-min-device-pixel-ratio: 2),
    only screen and (min--moz-device-pixel-ratio: 2),
    only screen and (-o-min-device-pixel-ratio: 2/1),
    only screen and (min-device-pixel-ratio: 2),
    only screen and (min-resolution: 192dpi),
    only screen and (min-resolution: 2dppx) {
      .fblike {
        background-image: url(https://i7.createsend1.com/static/eb/beta/13-the-blueprint-3/images/fblike@2x.png) !important;
      }

      .tweet {
        background-image: url(https://i8.createsend1.com/static/eb/beta/13-the-blueprint-3/images/tweet@2x.png) !important;
      }

      .linkedinshare {
        background-image: url(https://i9.createsend1.com/static/eb/beta/13-the-blueprint-3/images/lishare@2x.png) !important;
      }

      .forwardtoafriend {
        background-image: url(https://i10.createsend1.com/static/eb/beta/13-the-blueprint-3/images/forward@2x.png) !important;
      }
    }

    @media (max-width: 321px) {
      .fixed-width.has-border .layout__inner {
        border-width: 1px 0 !important;
      }

      .layout,
      .stack .column {
        min-width: 320px !important;
        width: 320px !important;
      }

      .border {
        display: none;
      }

      .has-gutter .border {
        display: table-cell;
      }
    }

    .mso div {
      border: 0 none white !important;
    }

    .mso .w560 .divider {
      Margin-left: 260px !important;
      Margin-right: 260px !important;
    }

    .mso .w360 .divider {
      Margin-left: 160px !important;
      Margin-right: 160px !important;
    }

    .mso .w260 .divider {
      Margin-left: 110px !important;
      Margin-right: 110px !important;
    }

    .mso .w160 .divider {
      Margin-left: 60px !important;
      Margin-right: 60px !important;
    }

    .mso .w354 .divider {
      Margin-left: 157px !important;
      Margin-right: 157px !important;
    }

    .mso .w250 .divider {
      Margin-left: 105px !important;
      Margin-right: 105px !important;
    }

    .mso .w148 .divider {
      Margin-left: 54px !important;
      Margin-right: 54px !important;
    }

    .mso .size-8 {
      font-size: 8px !important;
      line-height: 14px !important;
    }

    .mso .size-9 {
      font-size: 9px !important;
      line-height: 16px !important;
    }

    .mso .size-10 {
      font-size: 10px !important;
      line-height: 18px !important;
    }

    .mso .size-11 {
      font-size: 11px !important;
      line-height: 19px !important;
    }

    .mso .size-12 {
      font-size: 12px !important;
      line-height: 19px !important;
    }

    .mso .size-13 {
      font-size: 13px !important;
      line-height: 21px !important;
    }

    .mso .size-14 {
      font-size: 14px !important;
      line-height: 21px !important;
    }

    .mso .size-15 {
      font-size: 15px !important;
      line-height: 23px !important;
    }

    .mso .size-16 {
      font-size: 16px !important;
      line-height: 24px !important;
    }

    .mso .size-17 {
      font-size: 17px !important;
      line-height: 26px !important;
    }

    .mso .size-18 {
      font-size: 18px !important;
      line-height: 26px !important;
    }

    .mso .size-20 {
      font-size: 20px !important;
      line-height: 28px !important;
    }

    .mso .size-22 {
      font-size: 22px !important;
      line-height: 31px !important;
    }

    .mso .size-24 {
      font-size: 24px !important;
      line-height: 32px !important;
    }

    .mso .size-26 {
      font-size: 26px !important;
      line-height: 34px !important;
    }

    .mso .size-28 {
      font-size: 28px !important;
      line-height: 36px !important;
    }

    .mso .size-30 {
      font-size: 30px !important;
      line-height: 38px !important;
    }

    .mso .size-32 {
      font-size: 32px !important;
      line-height: 40px !important;
    }

    .mso .size-34 {
      font-size: 34px !important;
      line-height: 43px !important;
    }

    .mso .size-36 {
      font-size: 36px !important;
      line-height: 43px !important;
    }

    .mso .size-40 {
      font-size: 40px !important;
      line-height: 47px !important;
    }

    .mso .size-44 {
      font-size: 44px !important;
      line-height: 50px !important;
    }

    .mso .size-48 {
      font-size: 48px !important;
      line-height: 54px !important;
    }

    .mso .size-56 {
      font-size: 56px !important;
      line-height: 60px !important;
    }

    .mso .size-64 {
      font-size: 64px !important;
      line-height: 68px !important;
    }

    .mso .size-72 {
      font-size: 72px !important;
      line-height: 76px !important;
    }

    .mso .size-80 {
      font-size: 80px !important;
      line-height: 84px !important;
    }

    .mso .size-96 {
      font-size: 96px !important;
      line-height: 100px !important;
    }

    .mso .size-112 {
      font-size: 112px !important;
      line-height: 116px !important;
    }

    .mso .size-128 {
      font-size: 128px !important;
      line-height: 132px !important;
    }

    .mso .size-144 {
      font-size: 144px !important;
      line-height: 148px !important;
    }

    /***
* Online store block styles
*
* 1. maintaining right and left margins in outlook
* 2. respecting line-height for tds in outlook
*/
    .mso .cmctbl table td,
    .mso .cmctbl table th {
      Margin-left: 20px !important;
      /* [1] */
      Margin-right: 20px !important;
      /* [1] */
    }

    .cmctbl--inline table {
      border-collapse: collapse;
    }

    .mso .cmctbl--inline table,
    .mso .cmctbl table {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      mso-line-height-rule: exactly;
      /* [2] */
    }
  </style>

  <!--[if !mso]><!-->
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic);
  </style>
  <link href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet"
    type="text/css" /><!--<![endif]-->
  <style type="text/css">
    .main,
    .mso {
      background-color: #fbfbfb
    }

    .logo a:hover,
    .logo a:focus {
      color: #1e2e3b !important
    }

    .footer-logo a:hover,
    .footer-logo a:focus {
      color: #372d1b !important
    }

    .mso .layout-has-border {
      border-top: 1px solid #c8c8c8;
      border-bottom: 1px solid #c8c8c8
    }

    .mso .layout-has-bottom-border {
      border-bottom: 1px solid #c8c8c8
    }

    .mso .border {
      background-color: #c8c8c8
    }

    .mso h1 {}

    .mso h1 {
      font-size: 26px !important;
      line-height: 34px !important
    }

    .mso h2 {}

    .mso h2 {
      font-size: 20px !important;
      line-height: 28px !important
    }

    .mso h3 {}

    .mso .layout__inner {}

    .mso .footer__share-button p {}

    .mso .footer__share-button p {
      font-family: Georgia, serif
    }
  </style>
  <meta name="robots" content="noindex,nofollow" />
  <meta property="og:title" content="My First Campaign" />
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->

<body class="main full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
  <!--<![endif]-->
  <table class="wrapper"
    style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fbfbfb;"
    cellpadding="0" cellspacing="0" role="presentation">
    <tbody>
      <tr>
        <td>
          <div role="banner">
            <div class="preheader"
              style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
              <div style="border-collapse: collapse;display: table;width: 100%;">
                <!--[if mso]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
                <div class="snippet"
                  style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #999;font-family: Georgia,serif;">

                </div>
                <!--[if mso]></td><td style="width: 280px" valign="top"><![endif]-->
                <div class="webversion"
                  style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #999;font-family: Georgia,serif;">

                </div>
                <!--[if mso]></td></tr></table><![endif]-->
              </div>
            </div>
            <div class="header"
              style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);"
              id="emb-email-header-container">
              <!--[if mso]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
              <div class="logo emb-logo-margin-box"
                style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #41637e;font-family: Avenir,sans-serif;Margin-left: 20px;Margin-right: 20px;"
                align="center">
                <div class="logo-center" align="center" id="emb-email-header"><img
                    style="display: block;height: auto;width: 100%;border: 0;max-width: 78px;" src="${process.env.LOGO}"
                    alt="" width="78" /></div>
              </div>
              <!--[if mso]></td></tr></table><![endif]-->
            </div>
          </div>
          <div>
            <div class="layout one-col fixed-width stack"
              style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
              <div class="layout__inner"
                style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
                <!--[if mso]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]-->
                <div class="column"
                  style="text-align: left;color: #565656;font-size: 14px;line-height: 21px;font-family: Georgia,serif;">

                  <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
                    <div style="mso-line-height-rule: exactly;line-height: 41px;font-size: 1px;">&nbsp;</div>
                  </div>

                  <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
                    <img style="border: 0;display: block;height: auto;width: 100%;max-width: 123px;" alt="" width="123"
                      src="images/undraw_Order_confirmed_re_g0if-9903cf028a01453c.png" />
                  </div>

                  <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
                    <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                      <h3
                        style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #555;font-size: 16px;line-height: 24px;font-family: Lato,Tahoma,sans-serif;">
                        <span class="font-lato" style="text-decoration: inherit;">You've received a new order.</span>
                      </h3>
                      <p style="Margin-top: 12px;Margin-bottom: 0;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;"><br />
                          Hello, ${user.NAME}:</span></p>
                      <p style="Margin-top: 20px;Margin-bottom: 20px;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;">You are receiving this email because a
                          customer purchased one of your products from Medic Apparels.</span></p>
                    </div>
                  </div>

                  <div style="Margin-left: 20px;Margin-right: 20px;">
                    <div style="mso-line-height-rule: exactly;line-height: 38px;font-size: 1px;">&nbsp;</div>
                  </div>

                  <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
                    <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-bottom"
                      style="border: 0;display: block;height: auto;width: 100%;max-width: 349px;" alt="" width="349"
                      src="${process.env.SITE_LINK}${product.MAIN_IMAGE}" />
                  </div>

                </div>
                <!--[if mso]></td></tr></table><![endif]-->
              </div>
            </div>

            <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>

            <div class="layout one-col fixed-width stack"
              style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
              <div class="layout__inner"
                style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
                <!--[if mso]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]-->
                <div class="column"
                  style="text-align: left;color: #565656;font-size: 14px;line-height: 21px;font-family: Georgia,serif;">

                  <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
                    <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                      <h3 class="size-17"
                        style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #555;font-size: 17px;line-height: 26px;font-family: Lato,Tahoma,sans-serif;text-align: center;"
                        lang="x-size-17"><span class="font-lato" style="text-decoration: inherit;"><span
                            style="text-decoration: inherit;color: #ff3b48;"><strong>Product
                              Details</strong></span></span></h3>
                    </div>
                  </div>

                  <div style="Margin-left: 20px;Margin-right: 20px;">
                    <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                      <p style="Margin-top: 0;Margin-bottom: 0;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;">PRODUCT ID: &nbsp; &nbsp; ${product.PRODUCT_ID}</span></p>
                      <p style="Margin-top: 20px;Margin-bottom: 0;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;">PRODUCT NAME: &nbsp; ${product.PRODUCT_NAME}</span></p>
                      <p style="Margin-top: 20px;Margin-bottom: 0;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;">PRODUCT DESCRIPTION:&nbsp;${product.PRODUCT_DESCRIPTION}</span></p>
                      <p style="Margin-top: 20px;Margin-bottom: 0;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;">PRODUCT SIZE: &nbsp; &nbsp; ${order.PRODUCT_SIZE}</span></p>
                      <p style="Margin-top: 20px;Margin-bottom: 0;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;">PRODUCT PRICE: &nbsp; &nbsp; ${Number(order.ORDER_PRICE).toLocaleString()}</span></p>
                      <p style="Margin-top: 20px;Margin-bottom: 0;font-family: 
Lato,Tahoma,sans-serif;"><span class="font-lato" style="text-decoration: inherit;">PRODUCT QUANTITY: &nbsp; &nbsp; ${order.ORDER_QUANTITY}</span></p>
                      <p style="Margin-top: 20px;Margin-bottom: 20px;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;">SUBTOTAL:&nbsp;&nbsp;${Number(order.FINAL_PRICE).toLocaleString()}</span></p>
                    </div>
                  </div>

                  <div style="Margin-left: 20px;Margin-right: 20px;">
                    <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                      <p style="Margin-top: 0;Margin-bottom: 20px;font-family: Lato,Tahoma,sans-serif;"><span
                          class="font-lato" style="text-decoration: inherit;">To view this order, please login to your
                          account on <a
                            style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #41637e;"
                            href="${process.env.SITE_LINK}">Medic Apparels</a></span></p>
                    </div>
                  </div>

                  <div style="Margin-left: 20px;Margin-right: 20px;">
                    <div class="divider"
                      style="display: block;font-size: 2px;line-height: 2px;Margin-left: auto;Margin-right: auto;width: 40px;background-color: #c8c8c8;Margin-bottom: 20px;">
                      &nbsp;</div>
                  </div>

                  <div style="Margin-left: 20px;Margin-right: 20px;">
                    <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
                  </div>

                  <div style="Margin-left: 20px;Margin-right: 20px;">
                    <div class="btn btn--ghost btn--medium" style="Margin-bottom: 20px;text-align: center;">
                      <!--[if !mso]><!--><a
                        style="border-radius: 4px;display: inline-block;font-size: 12px;font-weight: bold;line-height: 22px;padding: 10px 20px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ff3b48 !important;border: 1px solid #41637e;font-family: Lato, Tahoma, sans-serif;border-color: #ff3b48;"
                        href="${process.env.SITE_LINK}/product/${product.SLUG_ID}">View Product</a><!--<![endif]-->
                      <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${process.env.SITE_LINK}/product/${product.SLUG_ID}" style="width:84.75pt" arcsize="10%" filled="f" strokecolor="#41637E" strokeweight="1px"><v:textbox style="mso-fit-shape-to-text:t" inset="0pt,6.75pt,0pt,6.75pt"><center style="font-size:12px;line-height:22px;color:#FF3B48;font-family:Lato,Tahoma,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:2px">View Product</center></v:textbox></v:roundrect><![endif]-->
                    </div>
                  </div>

                  <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
                    <div style="mso-line-height-rule: exactly;line-height: 54px;font-size: 1px;">&nbsp;</div>
                  </div>

                </div>
                <!--[if mso]></td></tr></table><![endif]-->
              </div>
            </div>

            <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>

          </div>
          <div role="contentinfo">
            <div class="layout email-footer stack"
              style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
            </div>
            <div class="layout one-col email-footer"
              style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
              <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                <!--[if mso]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
                <div class="column"
                  style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Georgia,serif;">
                  <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                    <div style="font-size: 12px;line-height: 19px;margin-bottom: 15px;">
                      <span emb-social="preferences">
                        <preferences style="text-decoration: underline;" lang="en">Preferences</preferences>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                      </span>
                      <unsubscribe style="text-decoration: underline;">Unsubscribe</unsubscribe>
                    </div>
                  </div>
                </div>
                <!--[if mso]></td></tr></table><![endif]-->
              </div>
            </div>
          </div>
          <div style="line-height:40px;font-size:40px;" id="footer-spacing">&nbsp;</div>
        </td>
      </tr>
    </tbody>
  </table>
  <style type="text/css">
    @media (max-width:619px) {

      .email-flexible-footer .left-aligned-footer .column,
      .email-flexible-footer .center-aligned-footer,
      .email-flexible-footer .right-aligned-footer .column {
        max-width: 100% !important;
        text-align: center !important;
        width: 100% !important
      }

      .flexible-footer-logo {
        margin-left: 0px !important;
        margin-right: 0px !important
      }

      .email-flexible-footer .left-aligned-footer .flexible-footer__share-button__container,
      .email-flexible-footer .center-aligned-footer .flexible-footer__share-button__container,
      .email-flexible-footer .right-aligned-footer .flexible-footer__share-button__container {
        display: inline-block;
        margin-left: 5px !important;
        margin-right: 5px !important
      }

      .email-flexible-footer__additionalinfo--center {
        text-align: center !important
      }

      .email-flexible-footer .left-aligned-footer table,
      .email-flexible-footer .center-aligned-footer table,
      .email-flexible-footer .right-aligned-footer table {
        display: table !important;
        width: 100% !important
      }

      .email-flexible-footer .footer__share-button,
      .email-flexible-footer .email-footer__additional-info {
        margin-left: 20px;
        margin-right: 20px
      }
    }
  </style>
</body>

</html>
  `;

  mailer.sendMail(
    {
      subject: `New Order on product ${product.PRODUCT_ID} has been received`,
      from: `${process.env.MAIL_USER}`,
      to: `${user.NAME} <${user.EMAIL}>`,
      html: template,
    },
    (err, info) => {
      if (err) console.error(err);
      // console.log(info);
    }
  );
}

module.exports = orderVendorEmail;
