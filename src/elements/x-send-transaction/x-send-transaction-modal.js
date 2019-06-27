import { Utf8Tools, ValidationUtils } from '@nimiq/utils';
import XSendTransaction from './x-send-transaction.js' ;
import { MixinModalX } from '../mixin-modal/mixin-modal';
import { dashToSpace } from '../../lib/parameter-encoding.js';

export default class XSendTransactionModal extends MixinModalX(XSendTransaction) {
    allowsShow(address) {
        return address === '-' || !address || ValidationUtils.isValidAddress(dashToSpace(address));
    }

    /* mode: 'sender'|'recipient'|'contact'|'vesting'|'scan' */
    onShow(address, mode, amount, message, freeze) {

        this.$amountInput.maxDecimals = 5;

        if (address && mode === 'sender') {
            this.sender = dashToSpace(address);
        }

        if (address && (mode === 'recipient' || mode === 'vesting')) {
            this.recipient = dashToSpace(address);
        }

        if (mode === 'recipient') {
            this.$addressInput.$input.setAttribute('readonly', true);
            this.$('.link-contact-list').classList.add('display-none');
        } else {
            this.$addressInput.$input.removeAttribute('readonly');
            this.$('.link-contact-list').classList.remove('display-none');
        }

        if (address && mode === 'contact' && address !== '-') {
            this.recipient = dashToSpace(address);
        }

        if (amount) {
            this.amount = amount;
            this.$amountInput.$input.setAttribute('readonly', true);
        } else {
            this.$amountInput.$input.removeAttribute('readonly');
        }

        if (message) {
            this.message = decodeURIComponent(message);

            if (typeof this.message === 'Uint8Array') {
                this.message = Utf8Tools.utf8ByteArrayToString(message);
            }

            this.$extraDataInput.$input.setAttribute('readonly', true);
        } else {
            this.$extraDataInput.$input.removeAttribute('readonly');
        }

        if (mode === 'scan') {
            this._openQrScanner();
            this._isQrScanMode = true;
        } else {
            this._isQrScanMode = false;
        }

        this.validateAllFields();
    }

    onHide() {
        setTimeout(() => this._closeQrScanner(true), 400);
    }
}
