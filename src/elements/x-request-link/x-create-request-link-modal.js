import MixinModal from '../mixin-modal/mixin-modal.js';
import XElement from '../../lib/x-element/x-element.js';
import XAddress from '../x-address/x-address.js';
import XAccountsDropdown from '../x-accounts/x-accounts-dropdown.js';
import XAmountInput from '../x-amount-input/x-amount-input.js';
import VQrCodeOverlay from '../v-qr-code-overlay/v-qr-code-overlay.js';
import { createRequestLink, Currency, NimiqRequestLinkType } from '../../../node_modules/@nimiq/utils/dist/module/RequestLinkEncoding.js';
import share from '../../lib/web-share-shim/web-share-shim.nimiq.min.js';
import Config from '../../lib/config.js';

export default class XCreateRequestLinkModal extends MixinModal(XElement) {
    html() {
        return `
            <div class="modal-header">
                <i x-modal-close class="material-icons">close</i>
                <h2>Transaction Request</h2>
            </div>
            <div class="modal-body">
                <div class="center">
                    <x-accounts-dropdown name="recipient"></x-accounts-dropdown>
                    <ul>
                        <li>
                            <div class="address-label">Copy your address:</div>
                            <x-address></x-address>
                        </li>
                        <li>
                            <div>Or create a transaction request link:</div>
                            <div class="spacing-top"><x-amount-input></x-amount-input></div>
                            <div class="request-link-container spacing-top">
                                <div>
                                    <div>Copy your link:</div>
                                    <div class="x-request-link"></div>
                                </div>
                                <div class="qr-code-container">
                                    <div class="qr-code"></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <v-qr-code-overlay></v-qr-code-overlay>
        `;
    }

    children() {
        return [ XAddress, XAccountsDropdown, XAmountInput, VQrCodeOverlay ];
    }

    onCreate() {
        this._link = '';
        this._uri = '';
        this._shown = false;
        navigator.share = share;
        this.$requestLink = this.$('.x-request-link');
        this._qrCode = new NimiqVueComponents.QrCode({
            propsData: {
                size: this._isMobile()? this.$('.request-link-container').offsetWidth - 20 : 72
            }
        });
        this._qrCode.$mount(this.$('.qr-code'));
        super.onCreate();
    }

    listeners() {
        return {
            'x-account-selected': this._onAccountSelected.bind(this),
            'input x-amount-input': this._updateLink.bind(this),
            'click .x-request-link': () => navigator.share({
                title: 'Nimiq Transaction Request',
                text: 'Please send me Nimiq using this link:',
                url: this._link
            }),
            'click .qr-code-container': () => this._openQrOverlay(),
        }
    }

    onShow() {
        this._shown = true;
        this._updateLink();
    }

    onHide() {
        this._shown = false;
    }

    _onAccountSelected(address) {
        this._setAccount(address);
    }

    _setAccount(address) {
        this.$address.address = address;
        this._address = address;
        this._updateLink();
    }

    _updateLink() {
        if (!this._shown) return; // avoid rendering of qr code in background
        const baseUrl = Config.offlinePackaged
            ? 'https://safe.nimiq.com'
            : this.attributes.dataXRoot;
        this._link = createRequestLink(this._address, this.$amountInput.value, null, baseUrl);
        this._uri = createRequestLink(this._address, {
            currency: Currency.NIM,
            amount: this.$amountInput.value * 1e5 || undefined,
            type: NimiqRequestLinkType.URI,
        });
        this.$requestLink.textContent = this._link;
        this._qrCode.data = this._uri;
    }

    _openQrOverlay() {
        if (this._isMobile()) return;
        this.$vQrCodeOverlay.show(this._uri, 'Scan this QR code\nto send to this address');
    }

    _isMobile() {
        return window.innerWidth <= 420;
    }
}
