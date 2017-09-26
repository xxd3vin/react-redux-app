import Immutable from 'immutable';

function keyMirror(object) {
    return Immutable.fromJS(object).map((value, key) => {
        return value.map((actionValue, actionType) => `${key}_${actionType}`)
    }).toJS();
}

const actionType = keyMirror({
    common: {
        test: null
    },
    app: {
        index_init: null,
    },
    welcomeType: {
        hello: null, //测试
    },
    archType: {
        hello: null, //测试
    },
    portalQueryType: {
        hello: null,//测试
    }
});

export default actionType;

