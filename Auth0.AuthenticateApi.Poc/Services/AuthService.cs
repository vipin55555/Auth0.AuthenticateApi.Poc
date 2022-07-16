using Auth0.AuthenticationApi.Api.IServices;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using Auth0.AuthenticationApi.Models;

namespace Auth0.AuthenticationApi.Api.Services {
    public class AuthService : IAuthService {
        private IConfiguration _configuration;

        public AuthService(IConfiguration configuration) {
            this._configuration = configuration;
        }

        /// <summary>
        /// Get Auth0 Authorization Url
        /// </summary>
        /// <returns></returns>
        public string GenerateAuth0AuthorizationUrl() {

            try {
                AuthenticationApiClient client = new(_configuration["Auth0:Domain"]);

                var authorizationUrl = client.BuildAuthorizationUrl()
                  .WithResponseType(AuthorizationResponseType.Code)
                  .WithClient(_configuration["Auth0:ClientId"])
                  .WithScope(_configuration["Auth0:Scope"])
                  .WithAudience(_configuration["Auth0:ApiAudience"])
                  .WithState(Guid.NewGuid().ToString())
                  .WithRedirectUrl(_configuration["Auth0:RedirectUri"])
                  .Build();

                return  authorizationUrl.ToString() ?? "" ;
            } catch (Exception) {

                throw;
            }
        }

        /// <summary>
        /// Get Auth0 access token 
        /// </summary>
        /// <param name="authorize_code">This will be recieved via Auth0 Authorization Url</param>
        /// <returns></returns>
        public async Task<AccessTokenResponse> GetAuth0AccessToken(string authorize_code) {
            try {
                AuthenticationApiClient client = new(_configuration["Auth0:Domain"]);

                AccessTokenResponse token = await client.GetTokenAsync(new AuthorizationCodeTokenRequest {
                    Code = authorize_code ?? "",
                    ClientId = _configuration["Auth0:ClientId"],
                    ClientSecret = _configuration["Auth0:ClientSecret"],
                    SigningAlgorithm = JwtSignatureAlgorithm.RS256,
                    RedirectUri = _configuration["Auth0:RedirectUri"]
                });

                return token ;

            } catch (Exception) {

                throw;
            }
        }

        /// <summary>
        /// In this method simply return true as token is authenticated in middleware
        /// </summary>
        /// <returns></returns>
        public bool ValidateToken() {
            try {

                return true;

            } catch (Exception) {

                throw;
            }
        }
    }
}
