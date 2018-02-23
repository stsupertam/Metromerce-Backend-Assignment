var cron = require('cron');
const User = require('mongoose').model('User')

var gameJob = new cron.CronJob({
    cronTime: '* * * * * *',
    onTick: function() {
        User.update({ 'state.active': true}, {$inc: { 'state.expireTime': -1 }}, { multi: true })
            .then(() => {
                console.log('Decrease Time')
            })
            .catch((err) => {
                console.log(err)
            })
    }
});

gameJob.start()