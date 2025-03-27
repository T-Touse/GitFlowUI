import { RepoList } from "../components/RepoList";
import { HasSidebar, SidebarButton, SidebarMenu } from "../components/Sidebar";
import { TabList } from "../components/Tabs";
import { Grid } from "../utils/Grid";
import { BranchView } from "./BranchView";
import { CommitView } from "./CommitView";
import { ConflictView } from "./ConflictView";

export function AppView() {
	const tabs = ["Accueil", "Branches", "Commits", "Conflits"];
	const selectIndex = 0;
	let action = "branch"
	return (
		<section className="row">
			<HasSidebar>
				<SidebarMenu>
					<RepoList />
				</SidebarMenu>
				<div>
					<SidebarButton />
					{action === "branch" && <BranchView />}
					{action === "commit" && <CommitView />}
					{action === "conflict" && <ConflictView />}
				</div>
			</HasSidebar>
		</section>
	);
}
