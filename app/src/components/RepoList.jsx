import { translate } from "../utils/LanguageProvider"
import { SearchList } from "./SearchInput";

function listRepo(){
	return ["React", "Electron", "JavaScript", "CSS", "Tailwind"];
}

export function Repo({value}){
	return <article>{value}</article>
}

export function RepoList(){
	return (<div className="column repo-search">
		<SearchList placeholder={translate("search.repo")} get={listRepo} template={Repo} />
	</div>)
}