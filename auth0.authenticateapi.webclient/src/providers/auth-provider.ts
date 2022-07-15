import { createContext, useContext, useState, useEffect, useReducer } from "react"
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { core } from '../constants';

const AuthContext = createContext({
    isAuthenticated: false,
    isLoading: false,
    error: undefined,
    user: null,
    getAccessToken: () => { },
    login: () => { },
    logout: () => { },
});


const AuthProvider = (props:any) => {
    const apiBasePath = process.env.REACT_APP_API_BASE_PATH;
    const [state, dispatch] = useReducer(auth0Reducer, {
        isAuthenticated: false,
        isLoading: false,
        error: undefined,
        user: null,
    });
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!(searchParams.get("code") || "") && !getAccessToken()) {
            generateAuth0AuthorizationUrl();
        } else if ((searchParams.get("code") || "") && (searchParams.get("state") || "") && !getAccessToken()) {
            searchParams.set("state", "");
            setSearchParams(searchParams);
            getTokenFromApi(searchParams.get("code") || "");
        } else if (getAccessToken()) {
            dispatch({ type: core.constants.auth0.USER_AUTHENTICATED });
        }
    }, [location]);

    useEffect(() => {
        if (state.isAuthenticated && !state.user) {
            getUser();
        }
    }, [state?.isAuthenticated]);

    /**
     * 
     */
    const getUser = async () => {
        const resp = await callApi({
            url: `${apiBasePath}auth/getUser`,
            method: 'get',
            accessToken: getAccessToken() || ""
        });
        if (resp.status === core.constants.OP_SUCCESS) {
            dispatch({ type: core.constants.auth0.GET_USER_COMPLETE, payload: resp.data });
        } else {
            dispatch({ type: core.constants.auth0.ERROR, payload: resp.err_data });
        }
    }

    /**
     * 
     */
    const generateAuth0AuthorizationUrl = () => {
        dispatch({ type: core.constants.auth0.GET_ACCESS_TOKEN_STARTED })
        window.location.href = `${apiBasePath}auth/authorizationUrl`;
    }

    /**
     * 
     */
    const getTokenFromApi = async (authorize_code:string) => {
        dispatch({ type: core.constants.auth0.GET_ACCESS_TOKEN_STARTED })
        const resp = await callApi({
            url: `${apiBasePath}auth/accessToken?authorize_code=${authorize_code}`,
            method: 'get',
        });
        searchParams.set("code", "");
        setSearchParams(searchParams);
        if (resp.status === core.constants.OP_SUCCESS) {
            dispatch({ type: core.constants.auth0.GET_ACCESS_TOKEN_COMPLETE, payload: resp.data });
        } else {
            dispatch({ type: core.constants.auth0.GET_ACCESS_TOKEN_FAILED, payload: resp.err_data });
        }
    }

    /**
     * 
     */
    const logout = () => {
        localStorage.clear();
        generateAuth0AuthorizationUrl();
        dispatch({ type: core.constants.auth0.LOGOUT });
    }


    /**
     * 
     */
    const getAccessToken = () => {
        return localStorage.getItem("access_token") || "";
    }

    const contextValue = {
        ...state,
        getAccessToken,
        login: generateAuth0AuthorizationUrl,
        logout,
    };

    return (<AuthContext.Provider value={contextValue}>{props?.children}</AuthContext.Provider>)
}

export const auth0Reducer = (state:any, action:any) => {
    switch (action.type) {
        case core.constants.auth0.GET_ACCESS_TOKEN_STARTED:
            return {
                ...state,
                isAuthenticated: false,
                isLoading: true,
            };
        case core.constants.auth0.GET_ACCESS_TOKEN_COMPLETE:
            localStorage.setItem("access_token", action?.payload?.access_token || "");
            localStorage.setItem("id_token", action?.payload?.id_token || "");
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
            };
        case core.constants.auth0.GET_ACCESS_TOKEN_FAILED:
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: action?.payload,
            };
        case core.constants.auth0.USER_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: true
            };
        case core.constants.auth0.GET_USER_COMPLETE:
            return {
                ...state,
                user: action?.payload
            };
        case core.constants.auth0.LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null,
            };
        case core.constants.auth0.ERROR:
            return {
                ...state,
                isLoading: false,
                error: action?.payload
            };
        default:
            throw new Error();
    }
}

export { AuthProvider }
export const useAuth0 = () => useContext(AuthContext);