using Auth0.AuthenticationApi.Api.IServices;
using Auth0.AuthenticationApi.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Auth0.AuthenticateApi.Api {
    public partial class Startup {
        public IConfiguration Configuration { get; private set; }
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.AddSingleton<IConfiguration>(Configuration);
            services.AddControllers();
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Auth0.AuthenticateApi.Poc", Version = "v1" });
            });

            services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));


            // To show details of JWT validation error and see the problem
            IdentityModelEventSource.ShowPII = true;

            // Configure authentication with JWT
            ConfigureAuth(services);

            services.AddTransient<IAuthService, AuthService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Auth0.AuthenticateApi.Poc v1"));
            } else {
                app.UseHttpsRedirection();
            }


            app.UseRouting();

            // Use CORS
            app.UseCors("AllowAll");

            // Use authentication/authorization with JWT
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
        }
    }
}
