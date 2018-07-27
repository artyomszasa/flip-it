const express = require('express'),
    app = express(),
    cors = require('cors'),
    random = require('random-seed').create(),
    shuffle = require('shuffle-array'),
    Repo = require('./in-memory-repository'),
    pug = require('pug');

// **************************************************************************
// cards
const cards = '0123456789'.split('');

// **************************************************************************
// token generation
const Token = (function () {
    const crypto = require('crypto'),
        algorithm = 'aes-256-ctr',
        secret = 'ea1752b5f80db97e4de382bf84ff73be';

    const dedup = [];

    return class Token {
        static create () {
            let id = random.string(10);
            while (dedup.includes(id)) {
                id = random.string(10);
            }
            dedup.push(id);
            return id;
        }
        static encrypt (id) {
            const cipher = crypto.createCipher(algorithm, secret);
            let encrypted = cipher.update(id, 'utf8', 'hex');
            return encrypted + cipher.final('hex');
        }
        static decrypt (token) {
            const cipher = crypto.createDecipher(algorithm, secret);
            let plain = cipher.update(token, 'hex', 'utf-8');
            return plain + cipher.final('utf-8');
        }
    };
}());

// dummy (for code completion)
class Repository {
    /** @type Promise<Array> */
    get items () { throw new Error('not implemented'); }
    /**
     * Lookup item by id.
     * @param {String|Number} id
     * @return {Promise<Object>} - Either object with the requested id, or null;
     */
    lookup (id) { throw new Error('not implemented'); }
    /**
     * Insert or update object in the repository.
     * @param {Object} item
     * @return {Promise} - promise that is resolved once operation has finished.
     */
    upsert (item) { throw new Error('not implemented'); }
}

/** @type Repository */
const gameRepository = new Repo();
/** @type Repository */
const scoreRepository = new Repo('token');

app.use(cors());
app.use(express.json());

app.use('/assets', express.static('public'));
app.set('view engine', 'pug')

app.get('/game/:size', (req, resp) => {
    const size = parseInt(req.params.size, 10);
    if (!size || size < 6 || size > 20 || size % 2 !== 0) {
        resp.sendStatus(400);
    } else {
        const cardSource = cards.slice(0);
        const pictures = [];
        while (pictures.length < size) {
            const c = cardSource.splice(random.range(cardSource.length), 1)[0];
            pictures.push(c, c);
        }
        shuffle(pictures);
        const game = {
            id: Token.create(),
            pictures: pictures
        };
        gameRepository.upsert(game).then(() => {
            const gameDto = {
                token: Token.encrypt(game.id),
                pictures: game.pictures
            };
            resp.send(gameDto);
        });
    }
});

app.post('/score', (req, resp) => {
    const scoreReq = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!scoreReq || !scoreReq.token || !scoreReq.steps || !scoreReq.seconds) {
        resp.sendStatus(400);
    } else {
        const id = (function () {
            try {
                return Token.decrypt(scoreReq.token);
            } catch (_) {
                return null;
            }
        }());
        if (!id) {
            resp.sendStatus(400);
        } else {
            scoreRepository.upsert(Object.assign({}, scoreReq)).then(() => resp.sendStatus(200));
        }
    }
});

app.get('/score', (req, resp) => {
    scoreRepository.items.then(scores => {
        scores.sort((a, b) => a.seconds > b.seconds ? -1 : a.seconds > b.seconds ? 1 : 0);
        resp.send(scores.map(score => {
            return {
                seconds: score.seconds,
                steps: score.steps,
                name: score.name
            };
        }));
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(process.env.PORT || 80);