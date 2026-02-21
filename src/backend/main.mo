import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Required include for blob-storage
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Game Catalog Types
  public type Platform = {
    #pc;
    #ps5;
    #ps4;
    #xbox;
  };

  public type Game = {
    id : Text;
    name : Text;
    price : Nat;
    description : Text;
    image : Storage.ExternalBlob;
    trailerVideoUrl : ?Text;
    platform : Platform;
    onSale : Bool;
  };

  module Game {
    public func compare(game1 : Game, game2 : Game) : Order.Order {
      Text.compare(game1.name, game2.name);
    };
  };

  let games = Map.empty<Text, Game>();

  // Admin-only: Add new game
  public shared ({ caller }) func addGame(game : Game) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add games");
    };
    if (games.containsKey(game.id)) {
      Runtime.trap("Game with id " # game.id # " already exists");
    };
    games.add(game.id, game);
  };

  // Public: Get all games
  public query ({ caller }) func getAllGames() : async [Game] {
    games.values().toArray().sort();
  };

  // Admin-only: Update game
  public shared ({ caller }) func updateGame(id : Text, updatedGame : Game) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update games");
    };
    switch (games.get(id)) {
      case (?_) {
        games.add(id, updatedGame);
      };
      case (null) {
        Runtime.trap("Game with id " # id # " does not exist");
      };
    };
  };

  // Admin-only: Delete game
  public shared ({ caller }) func deleteGame(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete games");
    };
    if (not games.containsKey(id)) {
      Runtime.trap("Game with id " # id # " does not exist");
    };
    games.remove(id);
  };

  // Public: Get single game
  public query ({ caller }) func getGame(id : Text) : async ?Game {
    games.get(id);
  };

  // Public: Get games by platform
  public query ({ caller }) func getGamesByPlatform(platform : Platform) : async [Game] {
    games.values().filter(func(game) { game.platform == platform }).toArray();
  };

  // Public: Get games on sale
  public query ({ caller }) func getOnSaleGames() : async [Game] {
    games.values().filter(func(game) { game.onSale }).toArray();
  };
};
