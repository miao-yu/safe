/*import MixinModal from '../mixin-modal/mixin-modal.js';
import XElement from '../../lib/x-element/x-element.js';

export default class XCreateRequestLinkModal extends MixinModal(XElement) {
    onCreate() {
        this._shown = false;
        navigator.share = share;
        this._qrCode = new QrCode({
            propsData: {
                size: this._isMobile()? this.$('.request-link-container').offsetWidth - 20 : 72
            }
        });
        this._qrCode.$mount(this.$('.qr-code'));
        super.onCreate();
    }

    listeners() {
        return {
            'click .x-request-link': () => navigator.share({
                title: 'Nimiq Transaction Request',
                text: 'Please send me Nimiq using this link:',
                url: this._link
            }),
        }
    }

    onShow() {
        this._shown = true;
        this._updateLink();
    }

    onHide() {
        this._shown = false;
    }

    _updateLink() {
        if (!this._shown) return; // avoid rendering of qr code in background
        const baseUrl = Config.offlinePackaged
            ? 'https://safe.nimiq.com'
            : (this.attributes.dataXRoot || window.location.host);
    }
}*/
