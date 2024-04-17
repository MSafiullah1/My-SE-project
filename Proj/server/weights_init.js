const tf = require('@tensorflow/tfjs');
const jsonfile = require('jsonfile');

const Weights = require('./models/weights');

function init_weights(conn) {


    const db = conn;
    // Clear the weights collection
    db.collection('weights').deleteMany({});

    // Create a new set of weights
    const ML_weights = new Weights();


    // Load the JSON data
    jsonfile.readFile("employee_data_1.json", function (err, data) {
        if (err) {
            console.error(err);
            return;
        }

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [7] }));
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

        // Extract features and target
        let X = data.map(record => [record.task_completion_rate, record.attendance_rate, record.punctuality, record.efficiency, record.professionalism, record.collaboration, record.leadership]);
        let y = data.map(record => record.promotability_score);

        const X_train = tf.tensor2d(X, [X.length, X[0].length]);
        const y_train = tf.tensor2d(y, [y.length, 1]);

        model.fit(X_train, y_train, { epochs: 200 }).then(() => {

            // Get the weights of the dense layer
            const denseLayer = model.layers[0];
            const weights = denseLayer.getWeights()[0].dataSync();

            // Print the weights for each input feature
            const featureNames = ['task_completion_rate', 'attendance_rate', 'punctuality', 'efficiency', 'professionalism', 'collaboration', 'leadership'];
            for (let i = 0; i < featureNames.length; i++) {
                // round the weights to 2 decimal places
                ML_weights[featureNames[i]] = weights[i].toFixed(3);    
            }
            ML_weights.weightsID = 1;

            // Save the weights to the database
            db.collection('weights').insertOne(ML_weights, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('ML weights saved to database');
            });

            // Now create a set of weights for the admin. all weights are set to 1 initially
            const admin_weights = new Weights();
            admin_weights.weightsID = 2;
            admin_weights.task_completion_rate = 1;
            admin_weights.attendance_rate = 1;
            admin_weights.punctuality = 1;
            admin_weights.efficiency = 1;
            admin_weights.professionalism = 1;
            admin_weights.collaboration = 1;
            admin_weights.leadership = 1;

            // Save the weights to the database
            db.collection('weights').insertOne(admin_weights, (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Admin weights saved to database');
            });


        });
    });
}


module.exports = init_weights;
