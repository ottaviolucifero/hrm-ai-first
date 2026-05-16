import { TestBed } from '@angular/core/testing';

import { DeviceLabelPrintService } from './device-label-print.service';

describe('DeviceLabelPrintService', () => {
  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  it('creates a QR image data URL from the label payload', async () => {
    const service = createService();

    const result = await service.createQrDataUrl('DEV000001');

    expect(result).toMatch(/^data:image\/png;base64,/);
  });

  it('opens a single-label print document sized at 60x40 mm', async () => {
    const service = createService();
    const write = vi.fn();
    const open = vi.fn();
    const close = vi.fn();
    const focus = vi.fn();
    const print = vi.fn();

    vi.spyOn(window, 'open').mockReturnValue({
      document: {
        open,
        write,
        close,
        querySelector: vi.fn(() => null)
      },
      focus,
      print
    } as unknown as Window);

    const result = await service.printLabel({
      assetCode: 'DEV000001',
      qrValue: 'DEV000001'
    });

    expect(result).toBe(true);
    expect(write).toHaveBeenCalledWith(expect.stringContaining('@page {\n      size: 60mm 40mm;'));
    expect(write).toHaveBeenCalledWith(expect.stringContaining('DEV000001'));
    expect(write).not.toHaveBeenCalledWith(expect.stringContaining('Laptop Alpha'));
    expect(focus).toHaveBeenCalled();
    expect(print).toHaveBeenCalled();
  });

  it('returns false when the browser blocks the print popup', async () => {
    const service = createService();
    vi.spyOn(window, 'open').mockReturnValue(null);

    const result = await service.printLabel({
      assetCode: 'DEV000001',
      qrValue: 'DEV000001'
    });

    expect(result).toBe(false);
  });
});

function createService(): DeviceLabelPrintService {
  window.localStorage.setItem('hrflow.language', 'it');
  TestBed.configureTestingModule({});
  return TestBed.inject(DeviceLabelPrintService);
}
