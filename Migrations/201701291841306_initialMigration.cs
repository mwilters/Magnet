namespace Magnet.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initialMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Locations",
                c => new
                    {
                        ID = c.Guid(nullable: false),
                        Name = c.String(),
                        Address = c.String(),
                        Phone = c.String(),
                        PostalZip = c.String(),
                        City = c.String(),
                        ProvState = c.String(),
                        Country = c.String(),
                        Longitude = c.Double(nullable: false),
                        Latitude = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.WaitTimes",
                c => new
                    {
                        ID = c.Guid(nullable: false),
                        LocationID = c.Guid(nullable: false),
                        CurrentWaitTime = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.WaitTimes");
            DropTable("dbo.Locations");
        }
    }
}
