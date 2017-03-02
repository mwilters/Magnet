namespace Magnet.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class test : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Locations", "Distance", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Locations", "Distance");
        }
    }
}
