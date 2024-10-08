import { Commands, Command } from "./Commands.js";
import { CLIError } from "./CLIError.js";
import { Message, messages } from "./Message.js";

// Talvez, hubiera sido mejor hacer esto de otra forma.

export class CommandLine {

    constructor(sudo = false, body) {

        this.sudo = sudo
        this.body = body
        this.user = "root"
        this.command_provider = Commands
        this.commands =

        {
            "print": new Command("Print", "Prints that you put forward", (args) => { return this.command_provider.print(args) }),
            "clear": new Command("clear", "Clear the terminal", (args) => { return this.clear() }),
            "error": new Command("Error", "Give autogenerated error", (args) => { return this.command_provider.error(args) }),
            "help": new Command("Help", "Help with commands", (args) => { return this.help() }),
            "read": new Command("Read", "Read a message", (args) => { return this.read(args) }),
           //"chcprov": new Command("Chcset", "Change command provider", (args) => { return this.changeCommandSet(args) })
        }


        this.execute("print usa el comando 'read' con el mensaje 'felizcumpleaños'")

    }

    read(messageName) {

        let message = messages[messageName]
        return message.getTitle+"\n"+message.getContent
    }

    newLine() {
        return document.createElement("li");
    }

    addLine(text) {

        const new_line = this.newLine();

        new_line.textContent = text;
        this.body.appendChild(new_line);

    }

    retResult(data) {

        const new_line = this.newLine();

        new_line.classList.add("resultCommand");
        new_line.textContent = data;

        return new_line
    }

    retCommand(data, result, has_result = false) {

        const new_line = this.newLine();

        new_line.classList.add("command");
        new_line.textContent = this.user + " -> " + data;

        if (has_result) {
            new_line.appendChild(this.retResult(result))
        }

        return new_line

    }

    retError(data) {

        const new_line = this.retResult(data)

        new_line.classList.add("resultError");
        new_line.textContent = data;

        return new_line

    }

    remLine(args) {
        this.body.removeChild(this.body.lastChild);
    }

    changeCommandSet(args) {
        this.command_provider = args
    }

    clear() {
        const children = this.body.children;
        const elementsToRemove = [];

        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            if (element.id !== "space") {
                elementsToRemove.push(element);
            }
        }

        elementsToRemove.forEach(element => {
            element.remove();
        });

        return "";
    }

    help(args) {
        let data = ""
        for (let element in this.commands) {
            data += `·  [${element}]\n-> ( ${this.commands[element].description} )\n\n`
        }
        return data
    }

    execute(command) {

        const args = command.split(" ")
        const _command = args[0].toLowerCase()

        args.shift()

        if (!(_command in this.commands)) {

            const result = new CLIError("Not found command, please read the out of help command", 1)
            this.body.appendChild(this.retError(`[ Code Error ]: ${result.code}\n[Error]: ${result.message}.`))

        } else {

            console.log(_command);
            const result = this.commands[_command].do(args)
            console.log(result);
            console.log(this.commands[_command]);


            if (result instanceof CLIError) {

                this.body.appendChild(this.retError(`[ Code Error ]: ${result.code}\n[Error]: ${result.message}.`))


            } else {

                this.body.appendChild(this.retCommand(_command, result, true))

            }

        }

    }
}
