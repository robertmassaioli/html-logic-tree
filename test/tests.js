// test for basic node
var testData = new Array();

testData[0] = ({
        name: "node",
        type: "Val",
        value: "true"
    });

// a test for the and operator
testData[1] = ({
        type: "Op",
        value: "and",
        child: [{
            name: "A",
            type: "Val",
            value: "true"
        },
        {
            name: "B",
            type: "Val",
            value: "false"
        }]
    });

// same as two but the Or operator
testData[2] = ({
        type: "Op",
        value: "or",
        child: [{
            name: "A",
            type: "Val",
            value: "true"
        },
        {
            name: "B",
            type: "Val",
            value: "false"
        }]
    });

// same as two but the Or operator
testData[3] = ({
        "type": "Op",
        "value": "and",
        "child": [{
            "type": "Op",
            "value": "or",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "B",
                "type": "Val",
                "value": "false"
            }]
        },
        {
            "type": "Op",
            "value": "or",
            "child": [{
                "name": "C",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "D",
                "type": "Val",
                "value": "false"
            }]
        }]
    });

testData[4] = ({
        "type": "Op",
        "value": "or",
        "child": [{
            "type": "Op",
            "value": "and",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "B",
                "type": "Val",
                "value": "false"
            }]
        },
        {
            "type": "Op",
            "value": "and",
            "child": [{
                "name": "C",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "D",
                "type": "Val",
                "value": "false"
            }]
        }]
    });

// same as two but the Or operator
testData[5] = ({
        "type": "Op",
        "value": "and",
        "child": [{
            "type": "Op",
            "value": "or",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "B",
                "type": "Val",
                "value": "false"
            }]
        },
        {
            "name": "C",
            "type": "Val",
            "value": "true"
        }]
    });

// This is two or's
testData[6] = ({
        "type": "Op",
        "value": "or",
        "child": [{
            "type": "Op",
            "value": "or",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "B",
                "type": "Val",
                "value": "false"
            }]
        },
        {
            "name": "C",
            "type": "Val",
            "value": "true"
        }]
    });
