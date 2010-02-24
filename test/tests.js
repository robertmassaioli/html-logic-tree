//
// Please append any new test onto the end of this file so that test numbers remain the same.
// This way everybody will refer to the tests by the same number. Only change the ordering 
// If you have a really really good reason for doing so.
//
var testData = new Array();
var testDataInfo = new Array();

testDataInfo.push("A Basic node.");
testData.push({
    name: "node",
    type: "Val",
    value: "false"
});

testDataInfo.push("A test for the And operator.");
testData.push({
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

testDataInfo.push("same as two but the Or operator");
testData.push({
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

testDataInfo.push("An And containing Or's");
testData.push({
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

testDataInfo.push("An Or containing And's");
testData.push({
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

testDataInfo.push("Testing different node levels");
testData.push({
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

testDataInfo.push("This is two or's");
testData.push({
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

testDataInfo.push("This is three Or's, just to be sure.");
testData.push({
    "type": "Op",
    "value": "or",
    "child": [{
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
                "name": "D",
                "type": "Val",
                "value": "true"
            }]
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

testDataInfo.push("This is three And's, just to be sure.");
testData.push({
    "type": "Op",
    "value": "and",
    "child": [{
        "type": "Op",
        "value": "and",
        "child": [{
            "type": "Op",
            "value": "and",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "D",
                "type": "Val",
                "value": "maybe"
            }]
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

testDataInfo.push("Three ands but in reverse order to the last test.");
testData.push({
    "type": "Op",
    "value": "and",
    "child": [{
        "name": "C",
        "type": "Val",
        "value": "true"
    },
    {
        "type": "Op",
        "value": "and",
        "child": [{
            "name": "B",
            "type": "Val",
            "value": "false"
        },
        {
            "type": "Op",
            "value": "and",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "D",
                "type": "Val",
                "value": "maybe"
            }]
        }]
    }]
});

testDataInfo.push("A Basic node with a really long name.");
testData.push({
    name: "really super long name",
    type: "Val",
    value: "false"
});
