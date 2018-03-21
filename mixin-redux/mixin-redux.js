import { bindActionCreators } from '/libraries/redux/src/index.js';

const MixinRedux = XElementBase => class extends XElementBase {
    onCreate() {
        super.onCreate();

        const store = MixinRedux.store;

        if (!store) return;

        const { actions, mapStateToProps } = this.constructor;

        if (actions) {
            this.actions = bindActionCreators(actions, store.dispatch);
        }

        if (mapStateToProps) {
            const initialProperties = mapStateToProps(store.getState(), this.properties);
            this.setProperties(initialProperties);

            // subscribe to state updates
            this._unsubscribe = store.subscribe(() => {
                const properties = mapStateToProps(store.getState(), this.properties);

                this.setProperties(properties);
            });
        }
    }

    destroy() {
        super.destroy();

        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
};

export default MixinRedux;
