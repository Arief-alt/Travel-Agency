import {ID, OAuthProvider, Query} from "appwrite";
import {account, appwriteConfig, database} from "~/appwrite/client";
import {redirect} from "react-router";

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(
            OAuthProvider.Google,
            `${window.location.origin}/`,
            `${window.location.origin}/404`
        );
    } catch (e) {
        console.log('loginWithGoogle error:', e)
    }
}

export const getUser = async () => {
    try {
        const user = await account.get()
            .catch(e => {
                if(e.code === 401 || e.message.includes('guests')) {
                    return null;
                }
                throw e;
            });

        if(!user) return redirect('/sign-in')

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        )

        return documents[0] || null
    } catch (e) {
        console.log('getUser error:', e)
    }
}

export const logoutUser = async () => {
    try {
        await account.deleteSession('current')
        return true
    } catch (e) {
        console.log('logoutUser error:', e)
    }
}

export const getGooglePicture = async () => {
    try {
        const session = await account.getSession('current')

        const oAuthToken = session.providerAccessToken

        if (!oAuthToken) {
            console.log('No OAuth token found')
            return null
        }

        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photos',
            {
                headers: {
                    Authorization: `Bearer ${oAuthToken}`,
                },
            }
        )

        if (!response.ok) {
            console.log('Error fetching Google profile picture')
            return null
        }

        const data = await response.json()

        const photoUrl = data.photos && data.photos.length > 0 ? data.photos[0].url : null

        return photoUrl
    } catch (e) {
        console.log('getGooglePicture error:', e)
    }
}

export const storeUserData = async () => {
    try {
        const user = await account.get()

        if (!user) return null

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', user.$id)]
        )

        if (documents.length > 0) return documents[0]

        const imageUrl = await getGooglePicture()

        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                name: user.name,
                email: user.email,
                imageUrl: imageUrl || '',
                joinedAt: new Date().toISOString(),
            }
        )

        return newUser
    } catch (e) {
        console.log('storeUserData error:', e)
    }
}

export const getExistingUser = async (id: string) => {
    try {
        const user = await account.get()

        if (!user) return null

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', id)]
        )

        if (documents.length === 0) return null

        return documents[0]
    } catch (e) {
        console.log('getExistingUser error:', e)
    }
}

export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const { documents: users, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.limit(limit), Query.offset(offset)]
        )

        if (total === 0) return {users: [], total}

        return { users, total }
    } catch (e) {
        console.log('getAllUsers error:', e)
        return { users: [], total: 0 }
    }
}