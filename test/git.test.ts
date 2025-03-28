import { git } from "../src/git/cmd";
import { persistant } from "../src/Persistance";

class A{
	@persistant("repositories")
	array = []
}
const a = new A
console.log(a)
//console.log(await git.commit("message"))