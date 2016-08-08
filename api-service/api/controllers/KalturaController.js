var rabbit = require('replay-rabbitmq'),
    JobsService = require('replay-jobs-service');

// have to pre-define the video file exetnsions since Kaltura providers only the name without the extension.
var videoFileExtension = '.ts';
var jobTag = 'FetchVideoFromProvider';

module.exports = {

    onUploadFinished: function(req, res, next) {
        if (!validateInput(req.body)) {
            console.log("Bad input was received.");
            next(err);
        }

        produceNewVideoJob(req.body.entryId, req.body.name);
        res.ok();
    }
}

function validateInput(requestBody) {
    if (!requestBody.entryId || !requestBody.name) {
        return false;
    }

    return true;
}

function produceNewVideoJob(entryId, videoName) {
    // get the matching queue name of the job type
    queueName = JobsService.getQueueName(jobTag);

    var message = {
        provider: 'kaltura',
        providerId: entryId,
        videoName: videoName + videoFileExtension
    }

    var host = process.env.RABBITMQ_HOST || 'localhost';
    rabbit.connect(host)
        .then(function() {
            rabbit.produce(queueName, message);
        })
        .catch(function(err) {
            if (err) {
                console.log(err);
            }
        });
}
