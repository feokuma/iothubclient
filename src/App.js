import { EventHubConsumerClient } from "@azure/event-hubs";
import { Client as DirectMethodClient } from "azure-iothub";
import { useEffect, useState } from "react";
import "./App.css";

const eventHubConnectionString = "<Built-in Endpoint>";
const directMethodClient = DirectMethodClient.fromConnectionString(
    "<Shared Access Polices - device>"
);

function App() {
    const [ledStatus, setLedStatus] = useState(false);

    useEffect(() => {
        console.log("IoT Hub Quickstarts - Read device to cloud messages.");

        const handleEvents = (messages) => {
            for (const message of messages) {
                console.log(
                    `Led Status: ${JSON.stringify(message.body["ledStatus"])}`
                );
                setLedStatus(message.body["ledStatus"]);
            }
        };

        // Create the client to connect to the default consumer group of the Event Hub
        const consumerClient = new EventHubConsumerClient(
            "$Default",
            eventHubConnectionString,
            {}
        );

        // Subscribe to messages from all partitions as below
        // To subscribe to messages from a single partition, use the overload of the same method.
        const subscribe = consumerClient.subscribe({
            processEvents: handleEvents,
            processError: (error) => {
                console.error(error);
            },
        });

        return () => subscribe.close();
    }, []);

    function callDirectMethod(e) {
        e.preventDefault();
        var methodParams = {
            methodName: "DirectMethodTest",
            payload: "buttonClicked",
            responseTimeoutInSeconds: 30,
        };
        directMethodClient.invokeDeviceMethod(
            "edgeDevice",
            "WorkerModule",
            methodParams
        );
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Azure IoT Hub</h1>
                <h2>Acesse: ioteventhubdemo.azurewebsites.net</h2>
            </header>
            <main>
                <h2>Led Status: {ledStatus ? "ON" : "OFF"}</h2>
                <button onClick={callDirectMethod}>Change led status</button>
            </main>
        </div>
    );
}

export default App;
