assert = require('chai').assert

class PromiseStop extends Error {
}

const FOUND_CONFIG = 0
const NO_USER = 1

function fetchConfigForUserUsecaseWithException(userName, fetchUsersGateway, fetchUserConfigGateway) {
    return new Promise((resolve, reject) => {
        fetchUsersGateway(userName)
            .then((users) => {
                if (users.length >= 1) {
                    return fetchUserConfigGateway(users[0])
                } else {
                    resolve({action: NO_USER, data: 'No users. :('}) // this is the output to the user, implemented apart from the app core
                    throw new PromiseStop() // You can resolve your promise and still raise an Error to break the chain...
                }
            })
            .then((config) => {
                resolve({action: FOUND_CONFIG, data: config}) // this then() won't be executed in case of failure
            })
            .catch((error) => {
                if (!(error instanceof PromiseStop)) { // ...but we still have to ignore our custom error, and redirect the real ones.
                    reject(error)
                }
            })
    })
}

function fetchConfigForUserUsecaseWithNestedPromise(userName, fetchUsersGateway, fetchUserConfigGateway) {
    return new Promise((resolve, reject) => {
        fetchUsersGateway(userName)
            .then((users) => {
                if (users.length >= 1) {
                    return fetchUserConfigGateway(users[0])
                        .then((config) => { // Nested promises are ugly, imagine that you have more cases in here.
                            resolve({action: FOUND_CONFIG, data: config})
                        })
                } else {
                    resolve({action: NO_USER, data: 'No users. :('})
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}

describe('Clean Architecture with Promises concept', () => {

    function fetchUsersGatewayFake(name) {
        return Promise.resolve(['user1', 'user2'].filter((user) => user == name))
    }

    function fetchUserConfigGatewayFake(user) {
        return Promise.resolve('nice info for user: ' + user)
    }


    let usecase = fetchConfigForUserUsecaseWithException
    //let usecase = fetchConfigForUserUsecaseWithNestedPromise

    it('should fetch user config (the happy path)', () => {
        return usecase('user1', fetchUsersGatewayFake, fetchUserConfigGatewayFake).then(result => {
            assert.equal(result.action, FOUND_CONFIG)
            assert.equal(result.data, 'nice info for user: user1')
        })
    })

    it('should present a failure', () => {
        return usecase('invalid-user', fetchUsersGatewayFake, fetchUserConfigGatewayFake).then(result => {
            assert.equal(result.action, NO_USER)
            assert.equal(result.data, 'No users. :(')
        })
    })
})
