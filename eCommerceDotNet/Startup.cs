using System;
using System.Collections.Generic;
using eCommerceDotNet.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace eCommerceDotNet
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            IConfigurationBuilder builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                //load configuration from appsettings.json
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                //now override configuration in any custom appsettings related to the current environment (dev/test/prod)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(20); //default session timeout
                options.Cookie.HttpOnly = true;
            });

            services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            using (IServiceScope serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                AppDbContext context = serviceScope.ServiceProvider.GetService<AppDbContext>();
                //int count = await context.Products.CountAsync();
                //if(count ==0)
                //{
                //    Data.ProductsData productsData = new Data.ProductsData();
                //    productsData.list.ForEach(async x => { await context.Products.AddAsync(x); });
                //    context.SaveChanges();
                //}
                context.Database.Migrate();
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseSession();
            app.UseMvc();

        }
    }
}
