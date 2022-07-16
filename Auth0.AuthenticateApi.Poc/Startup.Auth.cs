using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;

namespace Auth0.AuthenticateApi.Api {
    public partial class Startup {

        /// <summary>
        /// Configure JWT auth
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureAuth(IServiceCollection services) {

            var validIssuer = Configuration["Auth0:Issuer"];

            // We need open connect with auth0 register domain to get signed keys
            // To know more, follow: https://stackoverflow.com/questions/58856735/idx10501-signature-validation-failed-unable-to-match-keys
            var configManager = new ConfigurationManager<OpenIdConnectConfiguration>($"{validIssuer}.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
            var openidconfig = configManager.GetConfigurationAsync().Result;

            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters {

                        // Validate the JWT Issuer (iss) claim
                        ValidateIssuer = false,
                        ValidIssuer = validIssuer,

                        // Validate the JWT Audience (aud) claim
                        RequireAudience = true,
                        ValidateAudience = true,
                        ValidAudiences = new List<string> { Configuration["Auth0:ApiAudience"] },

                        // Signing key
                        RequireSignedTokens = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKeys = openidconfig.SigningKeys,

                        // Validate the token expiry for API users
                        ValidateLifetime = true,
                    };
                });

            // Enable the use of an [Authorize("Bearer")] attribute on methods and classes to protect.
            services.AddAuthorization(auth => {
                auth.AddPolicy(JwtBearerDefaults.AuthenticationScheme, new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser().Build());
            });
        }
    }
}
