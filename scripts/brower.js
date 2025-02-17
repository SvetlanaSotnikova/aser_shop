// SlyQgsAU/sbiPsEpycLE6apc2FhaXw/MgUJIMTa8mZEJGaiIA98XrwIpGdLjWZsyD0euqtpxDrqVEwYEdjOY0vdJl20BYdkvf5KYIKSmDCFZGe2rp7RvDdpXUm7OQzLSjx73D9zb5iGgdq8w10kuoy2U1jGQJOy7IFRpEgRkXD0zFVjxqHoSXaRdtuFEuPfns4o4iwi5KW3we569Vx9nybA0mtyc8mhemL9GKrmNhadflwkJ4AjS/zFDTyuEHYh9XOJ9ipQnjL692h8JvZZBj1NllqZ2it+nDFG2bLRJXC+rfu5dOdQr6HRAaPEeeOgEpkFQPrLp6byunm8vywgetQ==
/**
 ** Copyright (C) 2024 Opera Norway AS. All rights reserved.
 **
 ** This file is part of the Opera web browser.
 **
 ** This script patches sites to work better with Opera
 ** For more information see http://www.opera.com/docs/browserjs/
 **
 ** If you have comments on these patches (for example if you are the webmaster
 ** and want to inform us about a fixed site that no longer needs patching)
 ** please report issues through the bug tracking system
 ** https://bugs.opera.com/
 **
 ** DO NOT EDIT THIS FILE! It will not be used by Opera if edited.
 **
 ** BROWSERJS_TIMESTAMP = '202402231442'; // for versioning; see DNA-54964
 **/

 'use strict';

 if (!location.href.includes('operabrowserjs=no')) {
     (function(document) {
         const { href, pathname, hostname } = location;
 
         /*
           We make references to the following functions to not get version that
           users
           have overwritten.
         */
         const setTimeout = window.setTimeout;
         const call = Function.prototype.call;
         const copyMethod = (method, ...defaultArgs) => {
             method.call = call;
             return (...args) => {
                 if (defaultArgs.length) {
                     args = defaultArgs.concat(args);
                 }
                 return method.call(...args);
             };
         };
 
         const addEventListener = copyMethod(Window.prototype.addEventListener);
         const appendChild = copyMethod(Node.prototype.appendChild);
         const createElement = copyMethod(Document.prototype.createElement);
         const createTextNode =
             copyMethod(Document.prototype.createTextNode, document);
         const setAttribute = copyMethod(Element.prototype.setAttribute);
         const querySelector = copyMethod(Document.prototype.querySelector);
 
         const version = () => {
             const total = Object.keys(PATCHES).length;
             /* eslint-disable max-len */
             return `Opera Desktop February 23, 2024. Active patches: ${total}`;
             /* eslint-enable max-len */
         };
 
         const isPartOfDomain = host =>
             hostname.endsWith(`.${host}`) || hostname === host;
         const hideOperaObject = () => {
             delete window.opr;
         };
         const hideOperaUserAgent = () => {
             const newUA = navigator.userAgent.replace(/ ?OPR.[0-9.]*.*/, '');
             Object.defineProperty(window.navigator, 'userAgent', { get: () => newUA });
         };
         const hideServiceWorker = () => {
             delete Navigator.prototype.serviceWorker;
         };
         const browserjsUrl = new URL('chrome://browserjs');
 
         const addCssToDocument = (cssText, doc = document, mediaType = '') => {
             addCssToDocument.styleObj = addCssToDocument.styleObj || {};
             let styles = addCssToDocument.styleObj[mediaType];
             if (!styles) {
                 const head = querySelector(doc, 'head');
                 if (!head) {
                     // head always present in html5-parsers, assume document not ready
                     addEventListener(doc, 'DOMContentLoaded', () => {
                         addCssToDocument(cssText, doc, mediaType);
                     }, false);
                     return;
                 }
                 styles = createElement(doc, 'style');
                 addCssToDocument.styleObj[mediaType] = styles;
                 setAttribute(styles, 'type', 'text/css');
                 if (mediaType) {
                     setAttribute(styles, 'media', mediaType);
                 }
                 appendChild(styles, createTextNode(' '));
                 appendChild(head, styles);
             }
             styles.firstChild.nodeValue += `${cssText}\n`;
             return true;
         };
 
         const PATCHES = {
             'PATCH-1190': {
                 description: 'Delta.com shows browser warning to Opera 25',
                 isMatching: () => isPartOfDomain('delta.com'),
                 apply: () => {
                     let value;
                     Object.defineProperty(window, 'UnsupportedBrowser', {
                         get: () => value,
                         set: arg => {
                             arg.badBrowser = () => false;
                             value = arg;
                         },
                     });
                 },
             },
             'PATCH-1220': {
                 description: 'To not force plugin download.',
                 isMatching: () => hostname.includes('.google.') &&
                     hostname.startsWith('talkgadget'),
                 apply: () => hideOperaUserAgent(),
             },
             'PATCH-1228': {
                 description: 'Block for delta-homes com spam site',
                 isMatching: () => isPartOfDomain('delta-homes.com'),
                 apply: () => location.replace('https://google.com'),
             },
             'PATCH-1252': {
                 description: 'Hide first-run overlay on read.amazon.com',
                 isMatching: () => isPartOfDomain('read.amazon.com'),
                 apply: () => {
                     addCssToDocument([
                         '.ui-dialog.firstRunDialog, ',
                         '.ui-dialog.firstRunDialog + .ui-widget-overlay ',
                         '{visibility:hidden}',
                     ].join(''));
                 },
             },
             'PATCH-1263': {
                 description: 'Hide Unsupported Browser dialog on clarks.co.uk',
                 isMatching: () => isPartOfDomain('clarks.co.uk'),
                 apply: () => {
                     addCssToDocument('#unsupportedBrowser {visibility:hidden}');
                 },
             },
             'PATCH-1269': {
                 description: 'Hide popup with ads.',
                 isMatching: () => hostname.startsWith('images.google.') ||
                     hostname.startsWith('www.google.'),
                 applyOnDOMReady: true,
                 apply: () => {
                     const href =
                         'https://www.google.com/url?q=/chrome/browser/desktop/';
                     const res = document.evaluate(
                         `//a[contains(@href, "${href}")]`, document, null,
                         XPathResult.ANY_TYPE, null);
                     const downloadLink = res.iterateNext();
                     if (downloadLink) {
                         const ad = downloadLink.closest('div[role="dialog"]');
                         if (ad) {
                             ad.style.display = 'none';
                         }
                     }
                 },
             },
             'PATCH-1277': {
                 description: 'Popup with ads.',
                 isMatching: () => isPartOfDomain('otvet.mail.ru'),
                 apply: () => {
                     addCssToDocument('#tb-39754319 {visibility:hidden}');
                     addCssToDocument('#tb-54288097 {visibility:hidden}');
                     addCssToDocument('#tb-54288098 {visibility:hidden}');
                     addCssToDocument('#tb-54288094 {visibility:hidden}');
                     addCssToDocument('#tb-54288099 {visibility:hidden}');
                     addCssToDocument('#tb-54288095 {visibility:hidden}');
                     addCssToDocument('#tb-54288093 {visibility:hidden}');
                     addCssToDocument('#tb-32116366 {visibility:hidden}');
                 },
             },
             'DNA-69435': {
                 description: 'Popup with ads in search results.',
                 isMatching: () => hostname.startsWith('yandex') &&
                     pathname.startsWith('/search/'),
                 apply: () => {
                     addCssToDocument('.popup2.distr-popup {visibility: hidden;}');
                 },
             },
             'DNA-69613': {
                 description: 'Unsupporting text block.',
                 isMatching: () => isPartOfDomain('tickets.oebb.at'),
                 apply: () => {
                     addCssToDocument('#settingErr {visibility:hidden}');
                 },
             },
             'DNA-72852': {
                 description: 'Fix music playing.',
                 isMatching: () => isPartOfDomain(
                     'streamdb3web.securenetsystems.net/cirrusencore/DEMOSTN'),
                 apply: () => hideOperaUserAgent(),
             },
             'DNA-85788': {
                 description: 'Text block with ads.',
                 isMatching: () => isPartOfDomain('russian.rt.com'),
                 apply: () => {
                     addCssToDocument('div#offers.offers {visibility:hidden}');
                 }
             },
             'DNA-84005': {
                 description: 'Unsupported message.',
                 isMatching: () => isPartOfDomain('comba-telecom.com'),
                 apply: () => {
                     hideOperaObject();
                     hideOperaUserAgent();
                 },
             },
             'DNA-79464': {
                 description: 'Unsupported message when play video.',
                 isMatching: () => isPartOfDomain('cbs.com'),
                 apply: () => {
                     hideOperaObject();
                     hideOperaUserAgent();
                 },
             },
             'DNA-85812': {
                 description: 'Unsupported text block in header.',
                 isMatching: () => isPartOfDomain('vk.com'),
                 apply: () => {
                     addCssToDocument('div#system_msg.fixed {visibility:hidden}');
                 }
             },
             'DNA-83244': {
                 description: 'Ads block in header.',
                 isMatching: () => isPartOfDomain('mail.com'),
                 apply: () => {
                     addCssToDocument('div.mod.mod-topper.promo {visibility:hidden}');
                 },
             },
             'DNA-85510': {
                 description: 'Unsupported page on entarance.',
                 isMatching: () => isPartOfDomain('famemma.tv'),
                 apply: () => {
                     hideOperaObject();
                     hideOperaUserAgent();
                 },
             },
             'DNA-97626': {
                 description: 'Fix video playing.',
                 isMatching: () => isPartOfDomain('highlive.tv'),
                 apply: () => {
                     hideOperaObject();
                     hideOperaUserAgent();
                 },
             },
             'DNA-90739': {
                 description: 'Help to get form information for Opera users',
                 isMatching: () => isPartOfDomain('opera.atlassian.net') &&
                     (pathname.startsWith('/servicedesk/customer/portal/9') ||
                     pathname.startsWith('/servicedesk/customer/portal/18') ||
                     pathname.startsWith('/servicedesk/customer/portal/20')),
                 applyOnDOMReady: true,
                 apply: async() => {
                     const findElement = selector => new Promise(resolve => {
                         setTimeout(() => resolve(querySelector(document, selector)), 100);
                     });
                     const waitForElement = async selector => {
                         for (let i = 0; i < 50; i++) {
                             const element = await findElement(selector);
                             if (element) {
                                 return element;
                             }
                         }
                         return null;
                     };
                     const setInputValue = (input, value) => {
                         const descriptor = Object.getOwnPropertyDescriptor(input, 'value');
                         let event = document.createEvent('UIEvents');
                         event.initEvent('focus', false, false);
                         input.dispatchEvent(event);
                         input.value = value + '!';
                         var desc = Object.getOwnPropertyDescriptor(input, 'value');
                         if (desc && desc.configurable) {
                             delete input.value;
                         }
                         input.value = value;
                         event = document.createEvent('HTMLEvents');
                         event.initEvent('propertychange', false, false);
                         event.propertyName = 'value';
                         input.dispatchEvent(event);
                         event = document.createEvent('HTMLEvents');
                         event.initEvent('input', true, false);
                         input.dispatchEvent(event);
                         if (descriptor) {
                             Object.defineProperty(input, 'value', descriptor);
                         }
                     };
 
                     const insertValueToInput = async(selector, value) => {
                         const inputElement = await waitForElement(selector);
                         if (inputElement) {
                             setTimeout(() => setInputValue(inputElement, value), 500);
                         }
                     };
 
                     const getGpuInformation = () => {
                         const gl = document.createElement('canvas').getContext('webgl');
                         if (!gl) {
                           return '';
                         }
                         const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                         if (debugInfo) {
                           return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                         }
                         return '';
                     };
 
                     const insertSystemInformation = () => {
                         insertValueToInput(
                             '#customfield_10072',
                             `${navigator.userAgent} (${navigator.language}), ${getGpuInformation()}`);
                     };
 
                     if (pathname.includes(
                             'servicedesk/customer/portal/9/group/11/create/') ||
                             pathname.includes(
                                 'servicedesk/customer/portal/18/group/32/create/')) {
                         insertSystemInformation();
                     }
 
                     const originalPushState = history.pushState;
                     history.pushState = function(...args) {
                         insertSystemInformation();
                         originalPushState.apply(history, args);
                     };
                 },
             },
             'DNA-90251': {
                 description: 'Customize button for add extensions.',
                 isMatching: () => isPartOfDomain('chrome.google.com') &&
                     pathname.startsWith('/webstore/'),
                 apply: () => {
                     addCssToDocument('div.yD5gtd {visibility:hidden}')
                     const targetNode = document.documentElement;
                     const config = { attributes: true, childList: true, subtree: true };
                     const callback = function(mutationsList, observer) {
                         for (const mutation of mutationsList) {
                             if (mutation.type === 'childList') {
                                 var webstoreButtons =
                                     document.querySelectorAll('.webstore-test-button-label');
                                 for (let webstoreButton of webstoreButtons) {
                                     if (webstoreButton.innerHTML.includes('Chrome')) {
                                         webstoreButton.innerHTML =
                                             webstoreButton.textContent = 'Add to Opera';
                                     }
                                 }
                             }
                         }
                     };
                     const observer = new MutationObserver(callback);
                     observer.observe(targetNode, config);
                 },
                 applyOnDOMReady: true,
             },
             'DNA-99267': {
                 description: 'Pretend to be Chrome on radio-south-africa.co.za',
                 isMatching: () => isPartOfDomain('radio-south-africa.co.za'),
                 apply: () => {
                     hideOperaObject();
                     hideOperaUserAgent();
                 },
             },
             'DNA-99293': {
                 description: 'Change game button.',
                 isMatching: () =>
                       isPartOfDomain('xsolla.com') &&
                       pathname.startsWith('/paystation3/'),
                 applyOnDOMReady: true,
                 apply: async() => {
                     const probeCondition = async (conditionFunction) => {
                         const sleep = (millis) => new Promise((resolve) =>
                               setTimeout(resolve), millis);
                         for (let i = 0; i < 100; i++) {
                           if (conditionFunction()) {
                             return true;
                           }
                           await sleep(50);
                         }
                         return false;
                       };
                     const findEULA = () => document.querySelector("a[href" +
                     "='https://www.opera.com/terms']");
                     const eula = await probeCondition(findEULA);
                     const targetNode = document.documentElement;
                     const config = {attributes: true,
                                     childList: true,
                                     subtree: true};
                     const callback = function(mutationsList, observer) {
                         for (const mutation of mutationsList) {
                             if (mutation.type === 'childList') {
                                 var backButtons =
                                     document.querySelectorAll('.btn.' +
                                     'btn-flat.btn-md.btn-accent.tab-focus');
                                 for (let backButton of backButtons) {
                                     if (backButton.innerHTML.includes('to' +
                                             ' the game')) {
                                         backButton.innerHTML =
                                           backButton.innerHTML.replace('to' +
                                             ' the game', '');
                                         addCssToDocument('svg {visibility: hidden;}');
                                     }
                                 }
                             }
                         }
                     };
                     setTimeout(() => {
                         const button =
                           document.querySelector('.btn.btn-flat.btn-md.'+
                                                  'btn-accent.tab-focus');
                         if (button) {
                         button.click();
                                     }
                                       }, 6000);
                     const observer = new MutationObserver(callback);
                     observer.observe(targetNode, config);
                 },
             },
             'DNA-99524': {
                 description: 'Browser.js version reported on browserjs page.',
                 isMatching: () => href === browserjsUrl.href,
                 applyOnDOMReady: true,
                 apply: () => {
                     const browserjs_info = version();
                     const addVersion =
                       createTextNode(`Today ${browserjs_info}`);
                     document.body.appendChild(addVersion);
                 },
             },
             'DNA-109866': {
                 description: 'Fix popup on Facebook.',
                 isMatching: () => isPartOfDomain('facebook.com'),
                 apply: () => {
                     addCssToDocument('div.xu96u03.xm80bdy.x10l6tqk.x13vifvy > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5 {visibility:hidden}');
                 }
             },
             'DNA-111340': {
                 description: 'Customize button for add extensions on new chrome webstore.',
                 isMatching: () => isPartOfDomain('chromewebstore.google.com'),
                 apply: () => {
                     addCssToDocument('div.yD5gtd {visibility:hidden}')
                     const targetNode = document.documentElement;
                     const config = { attributes: true, childList: true, subtree: true };
                     const callback = function(mutationsList, observer) {
                         for (const mutation of mutationsList) {
                             if (mutation.type === 'childList') {
                                 var webstoreButtons =
                                     document.querySelectorAll('span.UywwFc-vQzf8d');
                                 for (let webstoreButton of webstoreButtons) {
                                     if (webstoreButton.innerHTML.includes('Add to')) {
                                         webstoreButton.innerHTML =
                                             webstoreButton.textContent = 'Add to Opera';
                                     }
                                     else if (webstoreButton.innerHTML.includes('Remove from')) {
                                         webstoreButton.innerHTML =
                                             webstoreButton.textContent = 'Remove from Opera';
                                     }
                                 }
                             }
                         }
                     };
                     const observer = new MutationObserver(callback);
                     observer.observe(targetNode, config);
                 },
                 applyOnDOMReady: true,
             },
         };
 
         for (let key in PATCHES) {
             const {isMatching, apply,
                    applyOnDOMReady} = PATCHES[key];
             if (isMatching()) {
                 const run = () => {
                     apply();
                 };
 
                 if (applyOnDOMReady) {
                     addEventListener(document, 'DOMContentLoaded', run, false);
                 } else {
                     run();
                 }
             }
         }
     })(document);
 }
 