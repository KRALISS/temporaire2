/** @format */
import 'babel-polyfill';
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import setup from "./src/views/setup.js";

AppRegistry.registerComponent(appName, setup);
