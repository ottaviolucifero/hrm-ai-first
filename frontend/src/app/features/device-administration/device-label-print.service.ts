import { Injectable, inject } from '@angular/core';
import * as QRCode from 'qrcode';

import { I18nService } from '../../core/i18n/i18n.service';

export interface DeviceLabelPrintPayload {
  readonly assetCode: string;
  readonly qrValue: string;
}

@Injectable({ providedIn: 'root' })
export class DeviceLabelPrintService {
  private readonly i18n = inject(I18nService);

  async createQrDataUrl(value: string | null | undefined): Promise<string | null> {
    const normalized = value?.trim();
    if (!normalized) {
      return null;
    }

    return QRCode.toDataURL(normalized, {
      errorCorrectionLevel: 'M',
      margin: 0,
      width: 192,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  }

  async printLabel(payload: DeviceLabelPrintPayload): Promise<boolean> {
    const printWindow = window.open('', '_blank', 'popup=yes,width=420,height=320');
    if (!printWindow) {
      return false;
    }

    const qrDataUrl = await this.createQrDataUrl(payload.qrValue);
    if (!qrDataUrl) {
      printWindow.close();
      throw new Error('Missing QR payload.');
    }

    const documentTitle = [
      this.i18n.t('deviceAdministration.label.printDocumentTitle'),
      payload.assetCode.trim() || payload.qrValue.trim()
    ]
      .filter((value) => value.length > 0)
      .join(' - ');

    printWindow.document.open();
    printWindow.document.write(this.buildPrintDocument(payload, qrDataUrl, documentTitle));
    printWindow.document.close();

    await this.waitForQrImage(printWindow);

    printWindow.focus();
    printWindow.print();
    return true;
  }

  private async waitForQrImage(printWindow: Window): Promise<void> {
    const qrImage = printWindow.document.querySelector<HTMLImageElement>('[data-device-label-qr]');
    if (!qrImage || qrImage.complete) {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
      return;
    }

    await new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) {
          return;
        }

        settled = true;
        resolve();
      };

      qrImage.addEventListener('load', finish, { once: true });
      qrImage.addEventListener('error', finish, { once: true });
      window.setTimeout(finish, 1000);
    });
  }

  private buildPrintDocument(payload: DeviceLabelPrintPayload, qrDataUrl: string, documentTitle: string): string {
    const qrAlt = this.i18n.t('deviceAdministration.label.previewAlt');

    return `<!DOCTYPE html>
<html lang="${this.escapeHtml(this.i18n.language())}">
<head>
  <meta charset="utf-8" />
  <title>${this.escapeHtml(documentTitle)}</title>
  <style>
    @page {
      size: 60mm 40mm;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 60mm;
      height: 40mm;
      background: #ffffff;
      color: #0f172a;
      font-family: Arial, sans-serif;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .label-sheet {
      width: 60mm;
      height: 40mm;
      padding: 0;
      display: grid;
      place-items: center;
    }

    .label-content {
      display: grid;
      justify-items: center;
      align-content: center;
      gap: 1.8mm;
      width: 100%;
      height: 100%;
      padding: 3mm 2.5mm;
    }

    .label-content img {
      width: 24mm;
      height: 24mm;
      display: block;
    }

    .label-code {
      color: #0f172a;
      font-size: 3mm;
      font-weight: 700;
      letter-spacing: 0.18mm;
      line-height: 1.1;
      text-align: center;
      overflow-wrap: anywhere;
    }
  </style>
</head>
<body>
  <main class="label-sheet" aria-label="${this.escapeHtml(this.i18n.t('deviceAdministration.label.title'))}">
    <section class="label-content">
      <img src="${qrDataUrl}" alt="${this.escapeHtml(qrAlt)}" data-device-label-qr />
      <div class="label-code">${this.escapeHtml(payload.assetCode)}</div>
    </section>
  </main>
</body>
</html>`;
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
