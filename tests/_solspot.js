const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;
const assert = require('assert');


describe('solspot', () => {
   console.log("Starting test...")

   // Configure the client to use the local cluster.
   const provider = anchor.Provider.env();
   anchor.setProvider(provider);
   const program = anchor.workspace.Solspot;

   const initProfile = async (user, profile_address) => {
      await program.rpc.initialize({
         accounts: {
            profile: profile_address.publicKey,
            user,
            systemProgram: SystemProgram.programId,
         },
         signers: [profile_address],
      });
   }

   const updateProfile = async (user, profile_address, profileObj) => {
      // Update the Profile.
      await program.rpc.updateProfile(
         profileObj.bio, profileObj.color, profileObj.light,
         profileObj.indiv_type, profileObj.content,
         {
            accounts: {
               profile: profile_address.publicKey,
               user,
            },
         });
   }

   const deleteProfileAccount = async (user, profile_address) => {
      await program.rpc.deleteProfile({
         accounts: {
            profile: profile_address.publicKey,
            user,
         },
      });
   }

   /*
   it('can filter profiles by user', async () => {
       const user = program.provider.wallet.publicKey
       const profiles = await program.account.profile.all([
       {
           memcmp: {
           offset: 8, // Discriminator.
           bytes: user.toBase58(),
           }
       }
       ]);
   
       console.log(profiles);
       //console.log(profiles[0].account.user.toBase58());
   });
   */

   it('can init, update, and delete profile', async () => {
      // Init a new profile.
      const user = program.provider.wallet.publicKey;
      const profile_address = anchor.web3.Keypair.generate();
      let profile_data;

      let profileObj = {
         "bio": "Welcome to my solspot. wyd.",
         "color": "AAB3CD",
         "light": true,
         "indiv_type": true,
         "content": [
            { "name": "my constructed name", "url": "constructed url", id: 1 },
            { "name": "my constructed name 2", "url": "constructed url 2", id: 2 },
         ]
      };

      // init profile
      await initProfile(user, profile_address);

      // verify profile init
      profile_data = await program.account.profile.fetch(profile_address.publicKey);
      assert.equal(profile_data.bio, "");


      // update profile
      await updateProfile(user, profile_address, profileObj);

      // verify profile update
      profile_data = await program.account.profile.fetch(profile_address.publicKey);
      assert.equal(profile_data.bio, profileObj.bio);
      assert.equal(profile_data.color, profileObj.color);
      assert.equal(profile_data.lightTheme, true);
      assert.equal(profile_data.individual, true);
      assert.equal(profile_data.user.toBase58(), user.toBase58());




      // Delete the Profile
      await deleteProfileAccount(user, profile_address);
      profile_data = await program.account.profile.fetchNullable(profile_address.publicKey);
      assert.ok(profile_data === null);

   });

   it('cannot provide a bio with more than 150 characters...', async () => {
      // Init a new profile.
      const user = program.provider.wallet.publicKey;
      const profile_address = anchor.web3.Keypair.generate();

      let profileObj = {
         "bio": 'x'.repeat(151),
         "color": "AAB3CD",
         "light": true,
         "indiv_type": true,
         "content": [
            { "name": "my constructed name", "url": "constructed url", id: 1 },
            { "name": "my constructed name 2", "url": "constructed url 2", id: 2 },
         ]
      };

      // init profile
      await initProfile(user, profile_address);

      try {
         // update profile
         await updateProfile(user, profile_address, profileObj);
      }
      catch (error) {
         assert.equal(error.msg, 'The provided bio should be 150 characters long maximum.');
         return;
      }

      // Delete the Profile
      await deleteProfileAccount(user, profile_address);

      assert.fail('The provided bio should be 140 characters long maximum. !!!');

   });

   it('cannot provide a color with more than 6 characters...', async () => {
      // Init a new profile.
      const user = program.provider.wallet.publicKey;
      const profile_address = anchor.web3.Keypair.generate();

      let profileObj = {
         "bio": 'Bio for providing a issue. uh oh',
         "color": 'x'.repeat(7),
         "light": true,
         "indiv_type": true,
         "content": [
            { "name": "my constructed name", "url": "constructed url", id: 1 },
            { "name": "my constructed name 2", "url": "constructed url 2", id: 2 },
         ]
      };

      // init profile
      await initProfile(user, profile_address);

      try {
         // update profile
         await updateProfile(user, profile_address, profileObj);
      }
      catch (error) {
         assert.equal(error.msg, 'The provided color should be 6 characters long.');
         return;
      }

      // Delete the Profile
      await deleteProfileAccount(user, profile_address);

      assert.fail('The provided color should be 6 characters long. !!!');

   });


   it('find auth', async () => {
      // Init a new profile.
      const user = program.provider.wallet.publicKey;
      const profile_address = anchor.web3.Keypair.generate();



      let old_acc_address = "7eXSNy1Q2b7SLCWNtprRT6KAViDrk94jj2ht8z1UNoar";
      let offset_val = 8;
      let ad = new anchor.web3.PublicKey(old_acc_address)
      let profile = await program.provider.connection.getAccountInfo(new anchor.web3.PublicKey(ad.toString()));

      const profiles = await program.account.profile.all([
         {
            memcmp: {
               offset: 8, // Discriminator.
               bytes: new anchor.web3.PublicKey(ad.toString())
            }
         }
      ]);

      console.log(profiles)

   });
});
