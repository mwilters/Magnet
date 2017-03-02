using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;


namespace Magnet.Models
{
    public class ApplicationDbContext : DbContext
    {
        //Need to add our Domain classes so EF will know about them.  This is for code-first approach
        public DbSet<Location> Locations { get; set; }
        public DbSet<WaitTime> WaitTimes { get; set; }

        public ApplicationDbContext()
            : base("DefaultConnection")
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }

}