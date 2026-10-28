# Agent conventions

Written by Forge from the team Wiki. Coding agents (Forge, Claude, Devin…) read this file first.

### Answer general-knowledge questions directly
When the user asks a question that can be answered from general knowledge (programming concepts, languages, frameworks, tools, or widely known facts about a repository or its domain), simply reply with the information. Do not say you lack tools, cannot browse, or cannot access the repository, and do not add disclaimers about your capabilities. Only use the repo_* tools when the answer depends on the actual files of a specific repository.

### Search the linked repository first
If the user links a github repo when asking their question, search the repo for a response before defaulting to general knowledge. If there is no data related to that question within the linked repo inform the user of this and offer a general knowledge answer. When a repository is linked, this rule takes precedence over "Answer general-knowledge questions directly".

### Explore the repository before concluding
When a repository is linked, a repo_search_code search with no results does not mean the repository lacks the information: code search misses data files, forks and synonyms. Before telling the user the repository has nothing on a topic: (1) run repo_list_files to see the repository structure and what data is actually available; (2) repo_read_file the data and content files that could hold the answer (CSV, JSON, seed data, chapters, models, docs), paging through large files with start_line, and use repo_csv_summary to list the values of a relevant CSV column; (3) search again with related terms and synonyms (for example "realm", "country", "region", "place" or "location" when asked about "lands"). Related data counts as an answer: if the repository has a field, column or mention that covers the topic (such as a realm column on characters), answer from that data first and cite it, even if there is no dedicated dataset. Only then, clearly labelled as general knowledge, add what the repository does not cover. Say the repository has nothing only when the exploration found nothing related, naming the files you checked.
