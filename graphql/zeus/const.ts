/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Mutation:{
		createArticle:{

		}
	}
}

export const ReturnTypes: Record<string,any> = {
	Article:{
		id:"ID",
		title:"ID",
		url:"ID"
	},
	Mutation:{
		createArticle:"Article"
	},
	Query:{
		articles:"Article"
	}
}

export const Ops = {
mutation: "Mutation" as const,
	query: "Query" as const
}