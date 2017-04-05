"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var index_1 = require("./index");
var util_1 = require("./libs/util");
var _ = require("lodash");
var Query = (function () {
    function Query(options) {
        this.isRelation = false;
        this.queryObj = {};
        this.path = options.path;
        this.wilddog = options.wilddog;
        this.sync = this.wilddog.sync;
        this.relationClassName = options.relationClassName;
        this.relationName = options.relationName;
        this.isRelation = !!options.isRelation;
    }
    Query.prototype.get = function (key) {
        var _this = this;
        return new Promise(function (resolve) {
            var path = _this.path.join('/');
            var ref = _this.sync.ref(path).orderByChild(key);
            ref.once('value', function (ss) {
                var key = ss.key();
                var val = ss.val();
                var wdObject = new index_1.WdObject(_this.path, val, _this.wilddog);
                resolve(wdObject);
            });
        });
    };
    Query.prototype.equalTo = function (key, val) {
        if (this.isRelation) {
            util_1.warn('relation 暂不支持 equalTo');
        }
        else {
            this.queryObj.equalTo = { key: key, val: val };
        }
        return this;
    };
    Query.prototype.find = function () {
        var _this = this;
        if (this.isRelation) {
            var relationName = "_relation_" + this.relationClassName + "_" + this.relationName;
            util_1.log(this.path.concat([relationName]));
            return this.wilddog.Query(this.path.concat([relationName])).first()
                .then(function (res) {
                var keys = res.val;
                var p = _.map(keys, function (key) {
                    return _this.wilddog.Query([_this.relationClassName]).get(key);
                });
                return Promise.all(p);
            });
        }
        return new Promise(function (resolve) {
            var path = _this.path.join('/');
            var ref = _this.sync.ref(path);
            if (_this.queryObj.equalTo) {
                ref = ref.orderByChild(_this.queryObj.equalTo.key);
            }
            ref.once('value', function (ss) {
                var key = ss.key();
                var val = ss.val();
                var wdObject = new index_1.WdObject(_this.path, val, _this.wilddog);
                resolve([wdObject]);
            });
        });
    };
    Query.prototype.first = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.find()];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    Query.prototype.on = function (method, cb) {
        var _this = this;
        var path = this.path.join('/');
        var ref = this.sync.ref(path);
        if (this.queryObj.equalTo) {
            ref = ref.orderByChild(this.queryObj.equalTo.key);
        }
        ref.on(method, function (ss) {
            var key = ss.key();
            var val = ss.val();
            var wdObject = new index_1.WdObject(_this.path, val, _this.wilddog);
            cb(wdObject);
        });
    };
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=query.js.map