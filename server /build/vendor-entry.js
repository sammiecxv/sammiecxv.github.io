/* Entry point for the vendor bundle (public/dist/vendor.js).

   The app files read React off window instead of importing it, so I have to
   put it there myself. That's how the old CDN <script> tags worked, and
   changing it would mean editing every screen. */
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import qrcode from 'qrcode-generator';

window.React = React;
window.ReactDOM = ReactDOM;
window.qrcode = qrcode;
