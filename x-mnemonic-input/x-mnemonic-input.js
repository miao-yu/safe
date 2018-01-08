class XMnemonicInput extends XElement {

    children() {
        return [XSuccessMark];
    }

    onCreate() {
        // For making sure that nimiq.github.io loaded pages have the correct javascript for testing
        // Must be removed when this element is finished
        const $body = document.querySelector('body')
        $body.insertBefore(document.createTextNode('v6'), $body.firstChild);

        this.$fields = [];
        this.$form = this.$('form');
        for (let i = 0; i < 24; i++) {
            const field = XMnemonicInputField.createElement();
            this.$form.appendChild(field.$el);
            this.$fields.push(field);
        }
        this.$el.appendChild(this.$form);

        if(this._hasDatalistSupport()) this._createDatalist();
        else this.$fields.forEach(field => field.setupAutocomplete());

        this.addEventListener('complete', e => this._onFieldComplete(e));

        this.$fields[0].$input.focus();
    }

    _hasDatalistSupport() {
    	return !!( 'list' in document.createElement( 'input' ) ) &&
    		   !!( document.createElement( 'datalist' ) && window.HTMLDataListElement );
    }

    _createDatalist() {
        const datalist = document.createElement('datalist');
        datalist.setAttribute('id', 'x-mnemonic-wordlist');
        for( let i = 0; i < MnemonicPhrase.DEFAULT_WORDLIST.length; i++) {
            const option = document.createElement('option');
            option.textContent = MnemonicPhrase.DEFAULT_WORDLIST[i];
            datalist.appendChild(option);
        }
        this.$el.appendChild(datalist);
    }

    _onFieldComplete(e) {
        const completedField = e.detail[0];
        const wasCompletedByTab = e.detail[1];
        if (completedField.$input === document.activeElement && !wasCompletedByTab) {
            // Find active field
            const index = Array.prototype.indexOf.call(this.$fields, completedField);
            if (index < this.$fields.length - 1)
                // Set focus to next field
                this.$fields[index + 1].$input.focus();
        }

        this._checkPhraseComplete();
    }

    _checkPhraseComplete() {
        const check = this.$fields.find(field => !field.complete);
        if (typeof check !== 'undefined') return;
        const mnemonic = this.$fields.map(field => field.$input.value).join(' ');
        try {
            const privateKey = MnemonicPhrase.mnemonicToKey(mnemonic);
            this.fire('recovered', privateKey);
            this._animateSuccess();
        }
        catch(e) {
            console.log(e.message);
            this._animateError();
        }
    }

    _animateSuccess() {
        this.$el.classList.add('recovered');
        setTimeout(() => this.$successMark.animate(), 300);
        // setTimeout(() => this.$form.style.display = 'none', 500);
    }

    _animateError() {
        this.$el.classList.add('shake');
        setTimeout(() => this.$el.classList.remove('shake'), 820);
    }

    html() {
        return `
            <form autocomplete="off"></form>
            <x-mnemonic-input-success>
                <x-success-mark></x-success-mark>
                <h1>Validated</h1>
            <x-mnemonic-input-success>`;
    }
}

class XMnemonicInputField extends XElement {
    onCreate() {
        this.$input = this.$('input');

        this.$input.addEventListener('keydown', e => this._onKeyDown(e));
        this.$input.addEventListener('input', e => this._onInput(e));
        this.$input.addEventListener('blur', e => this._onBlur(e));

        this._value = '';
    }

    setupAutocomplete() {
        this.autocomplete = new autoComplete({
            selector: this.$input,
            source: (term, response) => {
                const list = MnemonicPhrase.DEFAULT_WORDLIST.filter(word => {
                    return word.slice(0, term.length) === term;
                });
                response(list);
            },
            minChars: 3,
            delay: 0,
            onSelect: () => {
                // Emulate the event from selecting a datalist item
                const e = { type: 'input' };
                this._onKeyDown(e);
            }
        });
    }

    validateValue(byTab) {
        const index = MnemonicPhrase.DEFAULT_WORDLIST.indexOf(this.$input.value);
        if (index < 0) {
            this.$input.classList.add('invalid');
            return;
        }

        this.complete = true;
        this.fire('complete', [this, !!byTab]);
        this.$input.classList.add('complete');
    }

    _onKeyDown(e) {
        // console.log('_onKeyDown', e.keyCode, e.type);
        if (e.keyCode === 32 /* space */ || e.keyCode === 9 /* tab */ || e.type === 'blur' || e.type === 'input') {
            if (this.$input.value.length >= 3) this.validateValue(e.keyCode === 9 /* tab */);
            if (e.keyCode === 32 /* space */ ) e.preventDefault();
        }
    }

    _onInput(e) {
        // console.log('_onInput', e.data);
        if(typeof e.data === 'undefined') { // No key pressed, but autocomplete selected
            this._onKeyDown(e);
            return;
        }

        let value = this.$input.value;

        if (value.toLowerCase() !== value) {
            this.$input.value = value.toLowerCase();
            value = this.$input.value;
        }

        if(value.length > 2) this.$input.setAttribute('list', 'x-mnemonic-wordlist');
        else this.$input.removeAttribute('list');

        if (this._value === value) return;

        this.complete = false;
        this.$input.classList.remove('complete');
        this.$input.classList.remove('invalid'); // Multiple classes in remove() are not supported by IE
        this._value = value;
    }

    _onBlur(e) {
        // console.log('_onBlur');
        if (this.complete) return;
        this._onKeyDown(e);
    }

    html() {
        return `<input type="text" autocorrect="off" autocapitalize="none" spellcheck="false">`;
    }
}