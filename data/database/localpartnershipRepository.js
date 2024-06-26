const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "advdatabase",
});
class LocalpartnershipRepository {
  addWorkshop(req, res) {
    const { userId } = req.session;
    const { workshopname, location, description, contactinfo } = req.body;

    const sql =
      "INSERT INTO localpartnerships (WorkshopName, Location, Description, ContactInfo , OwnerID) VALUES (?, ?, ?, ?, ?)";

    db.query(
      sql,
      [workshopname, location, description, contactinfo, userId],
      (error, results) => {
        if (error) {
          console.error("Error inserting project:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        res.status(201).json({
          message: "Workshop added successfully",
          workshopId: results.insertId,
        });
      }
    );
  }

  myWorkshops(req, res) {
    const { userId } = req.session;

    const sql = "SELECT * FROM localpartnerships WHERE OwnerID = ?";
    db.query(sql, [userId], (error, results) => {
      if (error) {
        console.error("Error searching for Workshop:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Yow have not workshop!😢" });
      }

      res.status(200).json({ Workshops: results });
    });
  }

  getWorkshopProfile(req, res) {
    const { userId } = req.session;
    const { id } = req.params;

    const sql = "SELECT * FROM localpartnerships WHERE WorkshopID = ? AND OwnerID = ?";
    db.query(sql, [id, userId], (error, results) => {
      if (error) {
        console.error("Error searching for Workshop:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Workshop not found" });
      }

      res.status(200).json({ Workshop: results[0] });
    });
  }

  updateWorkshopProfile(req, res) {
    const { ownerId } = req.session;
    const { id } = req.params;
    const { Workshopname, Location, Description, ContactInfo, cost } = req.body.workshop;

    // Check if the user exists
    db.query(
      "SELECT * FROM localpartnerships WHERE WorkshopID = ?",
      [id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: "Internal server error." });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: "Workshop not found." });
        }

        // Prepare an update query based on the fields the user wants to update
        const updateFields = [];
        const updateValues = [];

        if (Workshopname) {
          updateFields.push("WorkshopName = ?");
          updateValues.push(Workshopname);
        }
        if (Location) {
          updateFields.push("Location = ?");
          updateValues.push(Location);
        }
        if (Description) {
          updateFields.push("Description = ?");
          updateValues.push(Description);
        }

        // if (ContactInfo && Array.isArray(ContactInfo)) {
        //   const ContactInfoJSON = JSON.stringify(ContactInfo);

        //   updateFields.push('ContactInfo = ?');
        //   updateValues.push(ContactInfoJSON);
        // }
        if (ContactInfo) {
          updateFields.push("ContactInfo = ?");
          updateValues.push(ContactInfo);
        }

        if (cost) {
          updateFields.push(`Cost = ?`);
          updateValues.push(cost);
        }

        if (updateFields.length === 0) {
          return res
            .status(400)
            .json({ message: "No valid fields to update." });
        }

        // Construct the parameterized update query
        const updateQuery = `UPDATE localpartnerships SET ${updateFields.join(
          ", "
        )} WHERE WorkshopID = ?`;

        // Combine the values for the query
        const queryValues = [...updateValues, id];

        // Execute the parameterized query
        db.query(updateQuery, queryValues, (updateError) => {
          if (updateError) {
            return res.status(500).json({ message: "Workshop update failed." });
          }

          return res
            .status(200)
            .json({ message: "Workshop updated successfully." });
        });
      }
    );
  }

  deleteWorkshop(req, res) {
    const { id } = req.params;
    const WorkshopID = parseInt(id);

    const sql = "DELETE FROM localpartnerships WHERE WorkshopID = ?";
    db.query(sql, [WorkshopID], (error, results) => {
      if (error) {
        console.error("Error deleting workshop:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Workshop not found" });
      }

      res.status(200).json({
        message: "Workshop deleted successfully",
        WorkshopID: WorkshopID,
      });
    });
  }

  searchAllGroups(req, res) {
    const sql = "SELECT * FROM `group` WHERE Status = 0";

    db.query(sql, (error, results) => {
      if (error) {
        console.error("Error searching for groups:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.status(200).json({ groups: results });
    });
  }

  searchGroup(req, res) {
    const { id } = req.params;

    const sql = "SELECT * FROM `group` WHERE GroupID = ? AND Status = 0";
    db.query(sql, [id], (error, results) => {
      if (error) {
        console.error("Error searching for group:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Group not found" });
      }

      res.status(200).json({ group: results[0] });
    });
  }

  searchBookedGroup(req, res) {
    const { workshopid } = req.params;
    const sql = "SELECT * FROM localpartnerships WHERE WorkshopID = ?";
    db.query(sql, [workshopid], (error, ress) => {
      if (error) {
        console.error("Error searching for group:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (ress.length === 0) {
        return res.status(404).json({ error: "Workshop not found!" });
      }
      const groupid = ress[0].GroupID;
      const sql = "SELECT * FROM `group` WHERE GroupID = ? AND Status = 1";
      db.query(sql, [groupid], (error, results) => {
        if (error) {
          console.error("Error searching for group:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "You have not employment group yet!" });
        }

        res.status(200).json({ group: results[0] });
      });
    });
  }

  async groupEmployment(req, res) {
    const { userId } = req.session;
    const { workshopid } = req.params;
    var { groupid } = req.params;
  
    try {
      const sql = "SELECT * FROM localpartnerships WHERE WorkshopID = ? AND GroupID IS NULL";
      const [ress] = await db.promise().query(sql, [workshopid]);
  
      if (ress.length === 0) {
        return res.status(404).json({ error: "Workshop already has a group!😯" });
      } else {
        const [results] = await db.promise().query("SELECT * FROM `group` WHERE GroupID = ? AND Status = 0", [groupid]);
        if (results.length === 0) {
          return res.status(404).json({ error: "Group not found or already booked!😯" });
        }
  
        const updateQuery = `UPDATE localpartnerships SET GroupID = ? WHERE WorkshopID = ?`;
        const queryValues = [groupid, workshopid];
        await db.promise().query(updateQuery, queryValues);
  
        const uQuery = `UPDATE \`group\` SET Status = ? WHERE GroupID = ?`;
        const Values = ["1", groupid];
        await db.promise().query(uQuery, Values);

        // const uUserQuery = `UPDATE users SET GroupID = ? WHERE UserID = ?`;
        // const qUserValues = [groupid, userId];
        // await db.promise().query(uUserQuery, qUserValues);
  
        return res.json({ message: "Group Employment successfully." });
      }
    } catch (error) {
      console.error("Error employment for group:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  layingOffGroup(req, res) {
    const { workshopid } = req.params;
    let groupid = null;

    const sql = "SELECT * FROM localpartnerships WHERE WorkshopID = ?";
    db.query(sql, [workshopid], (error, results) => {
      if (error) {
        console.error("Error workshop for WorkshopID:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length !== 0) {
        groupid = results[0].GroupID;
      }

      if (groupid !== null) {
        const updateQuery = `UPDATE localpartnerships SET GroupID = ? WHERE WorkshopID = ?`;
        const queryValues = [null, workshopid];

        db.query(updateQuery, queryValues, (updateError) => {
          if (updateError) {
            return res
              .status(500)
              .json({ message: "Group Laying Off failed." });
          }

          const uQuery = `UPDATE \`group\` SET Status = ? WHERE GroupID = ?`;
          const Values = ["0", groupid];
          db.query(uQuery, Values, (updateError) => {
            if (updateError) {
              console.log(updateError);
              return res.status(500).json({ message: "Group Status failed." });
            }

            return res.json({ message: "Group Laying Off successfully." });
          });
        });
      } else {
        return res.status(404).json({ message: "Workshop not have group!😢" });
      }
    });
  }

  pendingProjects(req, res) {
    const { workshopid } = req.params;
    
    const sql = "SELECT * FROM craftprojects WHERE WorkshopID = ? AND Status IS NULL";
    db.query(sql, [workshopid], (error, results) => {
      if (error) {
        console.error("Error project for WorkshopID:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "This workshop havn't project pending!😢" });
      }

      return res.status(200).json({ pendingProjects: results });
    });
  }

  acceptProject(req, res) {
    const { workshopid } = req.params;
    const { projectid, cost } = req.body;

    const sql = "UPDATE craftprojects SET Cost = ?, Status = ? WHERE WorkshopID = ? AND ProjectID = ? AND Status IS NULL";
    db.query(sql, [cost, '0', workshopid, projectid], (error, results) => {
      if (error) {
        console.error("Error booking project for WorkshopID:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Project not found or already booked!😢" });
      }

      return res.status(200).json({ message: "Project book successfully!" });
    });
  }

  myProjects(req, res) {
    const { workshopid } = req.params;

    const sql = "SELECT * FROM craftprojects WHERE WorkshopID = ? AND Status = 0";
    db.query(sql, [workshopid], (error, results) => {
      if (error) {
        console.error("Error project for WorkshopID:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Workshop not have Projects!😢" });
      }

      return res.status(200).json({ projects: results });
    });
  }

  searchProject(req, res) {
    const { workshopid, projectid } = req.params;

    const sql = "SELECT * FROM craftprojects WHERE ProjectID = ? AND WorkshopID = ? AND  Status = 0";
    db.query(sql, [projectid, workshopid], (error, results) => {
      if (error) {
        console.error("Error search project:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Project not found!😢" });
      }

      return res.status(200).json({ project: results[0] });
    });

  }

  updateCost(req, res) {
    const { workshopid, projectid } = req.params;
    const { cost } = req.body;

    const sql = "UPDATE craftprojects SET Cost = ?  WHERE WorkshopID = ? AND ProjectID = ? AND Status = 0";
    db.query(sql, [cost, workshopid, projectid], (error, results) => {
      if (error) {
        console.error("Error update project for WorkshopID:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Project not found!😢" });
      }

      return res.status(200).json({ message: "Update Project successfully!" });
    });

  }

  async reducingCost(req, res) {
    const { workshopid, projectid } = req.params;

    try {
        let oldCost = 0;
        let resourceCost = 0;
        let newCost = 0;
        let groupID;
        const sql = "SELECT * FROM localpartnerships WHERE WorkshopID = ?";
        const [workshopResults] = await db.promise().query(sql, [workshopid]);

        if (workshopResults.length === 0) {
            return res.status(404).json({ message: "Workshop not found!😢" });
        }
        groupID = workshopResults[0].GroupID;

        const sql1 = "SELECT * FROM users WHERE GroupID = ? AND Active = 1";
        const [groupUsers] = await db.promise().query(sql1, [groupID]);

        if (groupUsers.length === 0) {
            return res.status(404).json({ error: "No user found!😢" });
        }

        for (const user of groupUsers) {
            const userId = user.UserID;
            const sql2 = "SELECT * FROM resource WHERE UserID = ?";
            const [userResources] = await db.promise().query(sql2, [userId]);

            if (userResources.length === 0) {
                continue;
            }

            for (let i = 0; i < userResources.length; i++) {
                resourceCost += parseInt(userResources[i].Cost);
            }
        }

        const projectSql = "SELECT * FROM craftprojects WHERE WorkshopID = ? AND ProjectID = ? AND Status = 0";
        const [projectResults] = await db.promise().query(projectSql, [workshopid, projectid]);

        if (projectResults.length === 0) {
            return res.status(404).json({ message: "project not found!😢" });
        } else {
            oldCost = projectResults[0].Cost;
            newCost = parseFloat((oldCost - (resourceCost * 0.70)).toFixed(3));
        }

        // console.log("resourceCost:", resourceCost);
        // console.log("oldCost:", oldCost);
        // console.log("newCost:", newCost);

        const updateCostSql = "UPDATE craftprojects SET Cost = ?  WHERE WorkshopID = ? AND ProjectID = ? AND Status = 0";
        db.query(updateCostSql, [newCost, workshopid, projectid], (error, results) => {
          if (error) {
            console.error("Error update project for WorkshopID:", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Project not found!😢" });
          }

          return res.status(200).json({ message: "Cost reduction completed successfully." });

        });

    } catch (error) {
        console.error("Error update project for WorkshopID:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
  }




  layingOffProject(req, res) {
    const { workshopid, projectid } = req.params;

    const sql = "UPDATE craftprojects SET WorkshopID = ?, Cost = ?, Status = ? WHERE WorkshopID = ? AND ProjectID = ? AND Status = 0";
    db.query(sql, [null, null, null, workshopid, projectid], (error, results) => {
      if (error) {
        console.error("Error laying Off project for WorkshopID:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Project not found or not booked!😢" });
      }

      return res.status(200).json({ message: "Laying Off Project successfully!" });
    });

  }

  finishProject(req, res) {
    const { workshopid, projectid } = req.params;

    const sql = "UPDATE craftprojects SET Status = ? WHERE WorkshopID = ? AND ProjectID = ? AND Status = 0";
    db.query(sql, ['1', workshopid, projectid], (error, results) => {
      if (error) {
        console.error("Error update project for WorkshopID:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Project not found!😢" });
      }

      return res.status(200).json({ message: "Finish Project successfully!" });
    });
  }

  sendMessage(req, res) {
    const { userId } = req.session.userId;
    const { to, message, ReceiverType } = req.body;
    const { workshopid } = req.params;

    if (!(to && message)) {
      return res.status(400).json({ message: "Invalid message data." });
    }

    db.query(
      "SELECT * FROM localpartnerships WHERE WorkshopID = ?",
      [workshopid],
      (userError, userResults) => {
        if (userError) {
          console.error("Error:", userError);
          return res.status(500).json({ message: "Internal server error." });
        }

        if (userResults.length === 0) {
          return res.status(404).json({ message: "The workshop does not exist!😢" });
        }

        if(ReceiverType == 'group') { //group
          db.query(
            "SELECT * FROM localpartnerships WHERE WorkshopID = ? AND GroupID = ?",
            [workshopid, to],
            (userError, userResults) => {
              if (userError) {
                console.error("Error:", userError);
                return res.status(500).json({ message: "Internal server error." });
              }
      
              if (userResults.length === 0) {
                return res.status(404).json({ message: "The Group does not exist!😢" });
              }

              const registrationDate = new Date();
              db.query(
                "INSERT INTO communication (SenderID, ReceiverID, Message, SenderType, ReceiverType, Timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                [workshopid, to, message, 'workshop', 'group', registrationDate],
                (insertError) => {
                  if (insertError) {
                    return res.status(400).json({ message: "Communication failed😢!" });
                  }

                  return res.status(200).json({ message: "Communication successfully😊." });
                }
              );
            }
          );
        }
        else if(ReceiverType == 'company') { // company
          db.query(
            "SELECT * FROM collaboration WHERE WorkshopID = ? AND CompanyID = ?",
            [workshopid, to],
            (userError, userResults) => {
              if (userError) {
                console.error("Error:", userError);
                return res.status(500).json({ message: "Internal server error." });
              }
      
              if (userResults.length === 0) {
                return res.status(404).json({ message: "The company does not exist!😢" });
              }

              const registrationDate = new Date();
              db.query(
                "INSERT INTO communication (SenderID, ReceiverID, Message, SenderType, ReceiverType, Timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                [workshopid, to, message, 'workshop', 'company', registrationDate],
                (insertError) => {
                  if (insertError) {
                    return res.status(400).json({ message: "Communication failed😢!" });
                  }

                  return res.status(200).json({ message: "Communication successfully😊." });
                }
              );
            }
          );
        }
        else if(ReceiverType == 'project') {
          db.query(
            "SELECT * FROM craftprojects WHERE WorkshopID = ? AND ProjectID = ?",
            [workshopid, to],
            (userError, userResults) => {
              if (userError) {
                console.error("Error:", userError);
                return res.status(500).json({ message: "Internal server error." });
              }
      
              if (userResults.length === 0) {
                return res.status(404).json({ message: "The project does not exist!😢" });
              }

              const registrationDate = new Date();
              db.query(
                "INSERT INTO communication (SenderID, ReceiverID, Message, SenderType, ReceiverType, Timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                [workshopid, to, message, 'workshop', 'project', registrationDate],
                (insertError) => {
                  if (insertError) {
                    return res.status(400).json({ message: "Communication failed😢!" });
                  }

                  return res.status(200).json({ message: "Communication successfully😊." });
                }
              );
            }
          );
        }
        else {
          return res.status(404).json({ message: "The ReceiverType does not exist!😢" });
        }
      }
    );


  }

  receivedMessages(req,res) {
    const { userId } = req.session.userId;
    const { workshopid } = req.params;

    db.query(
      "SELECT * FROM communication WHERE ReceiverID = ? AND (ReceiverType = 'workshop')",
      [workshopid],
      (insertError, results) => {
        if (insertError) {
          console.log("1111111", results);
          return res.status(400).json({ message: "Communication not found!😢" });
        }
        
        return res.status(200).json({ receivedMessages: results });
      }
    );
  }

  sentMessages(req,res) {
    const { userId } = req.session.userId;
    const { workshopid } = req.params;

    db.query(
      "SELECT * FROM communication WHERE SenderID = ? AND SenderType = 'workshop'",
      [workshopid],
      (insertError, results) => {
        if (insertError) {
          return res.status(400).json({ message: "Communication not found!😢" });
        }
        
        return res.status(200).json({ sentMessages: results });
      }
    );
  }

  deleteMessage(req,res) {
    const { userId } = req.session;
    const { workshopid, messageid } = req.params;

    db.query(
      "SELECT * FROM localpartnerships WHERE WorkshopID = ? AND OwnerID = ?",
      [workshopid, userId],
      (insertError, results) => {
        if (insertError) {
          return res.status(500).json({ message: "Internal server error." });
        }

        if(results.length === 0){
          return res.status(403).json({message:"Workshop not found!😢"});
        }

        db.query(
          "DELETE FROM communication WHERE MessageID = ? AND (SenderType = 'workshop' OR ReceiverType = 'workshop')",
          [messageid],
          (insertError, results) => {
            if (insertError) {
              return res.status(400).json({ message: "Communication not found!😢" });
            }
            
            return res.json({ message: 'Delete message successfully.😊' });
          }
        );    
      }
    );
  
  }

  deleteMessageHistory(req,res) {
    const { userId } = req.session;
    const { workshopid } = req.params;

    db.query(
      "SELECT * FROM localpartnerships WHERE WorkshopID = ? AND OwnerID = ?",
      [workshopid, userId],
      (insertError, results) => {
        if (insertError) {
          return res.status(500).json({ message: "Internal server error." });
        }

        if(results.length === 0){
          return res.status(403).json({message:"Workshop not found!😢"});
        }

        db.query(
          "DELETE FROM communication WHERE (SenderID = ? OR ReceiverID = ?) AND (SenderType = 'workshop' OR ReceiverType = 'workshop')",
          [workshopid, workshopid],
          (insertError, results) => {
            if (insertError) {
              return res.status(400).json({ message: "Communication not found!😢" });
            }
            
            return res.json({ message: 'Delete message successfully.😊' });
          }
        );    
      }
    );
  }

}

module.exports = LocalpartnershipRepository;
